from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("useraccount", "0003_user_is_verified_verification_code_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="is_verified",
        ),
        migrations.RemoveField(
            model_name="user",
            name="verification_code",
        ),
        migrations.RemoveField(
            model_name="user",
            name="verification_expires_at",
        ),
    ]
