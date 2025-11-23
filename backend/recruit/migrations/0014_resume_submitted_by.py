from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("recruit", "0013_resume_jobdesc"),
    ]

    operations = [
        migrations.AddField(
            model_name="resume",
            name="submitted_by",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=models.CASCADE,
                related_name="submitted_resumes",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
