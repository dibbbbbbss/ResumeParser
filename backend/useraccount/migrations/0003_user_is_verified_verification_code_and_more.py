from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("useraccount", "0002_alter_user_role"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="is_verified",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="user",
            name="verification_code",
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
        migrations.AddField(
            model_name="user",
            name="verification_expires_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
