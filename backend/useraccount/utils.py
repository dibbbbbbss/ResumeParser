from django.core.mail import EmailMessage
from decouple import config
import requests


class Util:
    @staticmethod
    def send_email(data):
        mailtrap_token = config("MAILTRAP_TOKEN", default=None)
        from_email = config("EMAIL_HOST_FROM")

        if mailtrap_token:
            payload = {
                "from": {"email": from_email},
                "to": [{"email": data["to_email"]}],
                "subject": data["subject"],
                "text": data["body"],
            }
            headers = {
                "Authorization": f"Bearer {mailtrap_token}",
                "Content-Type": "application/json",
            }
            try:
                response = requests.post(
                    "https://send.api.mailtrap.io/api/send",
                    json=payload,
                    headers=headers,
                    timeout=10,
                )
                response.raise_for_status()
                return
            except requests.RequestException as exc:
                # Log and fall back to SMTP if API call fails
                print(f"Mailtrap API send failed: {exc}. Falling back to SMTP.")

        try:
            email = EmailMessage(
                subject=data["subject"],
                body=data["body"],
                from_email=from_email,
                to=[data["to_email"]],
            )
            email.send(fail_silently=True)
        except Exception as exc:
            # Last resort: log but do not break registration flow
            print(f"SMTP send failed: {exc}")
