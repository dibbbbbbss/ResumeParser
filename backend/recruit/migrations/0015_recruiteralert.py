from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("recruit", "0014_resume_submitted_by"),
    ]

    operations = [
        migrations.CreateModel(
            name="RecruiterAlert",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("score", models.FloatField(default=0)),
                ("is_read", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "jobdesc",
                    models.ForeignKey(
                        on_delete=models.CASCADE,
                        related_name="alerts",
                        to="recruit.jobdesc",
                    ),
                ),
                (
                    "recruiter",
                    models.ForeignKey(
                        on_delete=models.CASCADE,
                        related_name="alerts",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "resume",
                    models.ForeignKey(
                        on_delete=models.CASCADE,
                        related_name="alerts",
                        to="recruit.resume",
                    ),
                ),
            ],
        ),
    ]
