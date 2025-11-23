from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from recruit.views import (
    parse_resume,
    parse_jd,
    get_parsed_data,
    get_parsedjd_data,
    get_ranked_resume,
    get_job_data,
    get_job_detail,
    delete_job_desc,
    delete_application,
    recruiter_alerts,
    mark_alert_read,
    my_applications,
)
app_name="recruit"
urlpatterns = [
    
    path('resumeparser/',csrf_exempt(parse_resume)),
    path('jdparser/',csrf_exempt(parse_jd)),
    path('get-parsed-data/',csrf_exempt(get_parsed_data)),
    path('get-parsedjd-data/',csrf_exempt(get_parsedjd_data)),
    path('get-job-data/',csrf_exempt(get_job_data)),
    path('get-job-detail/<int:job_id>/',csrf_exempt(get_job_detail)),
    path('get-ranked-resume/<int:job_desc_id>/',csrf_exempt(get_ranked_resume)),
    path('delete-job/<int:job_id>/', csrf_exempt(delete_job_desc)),
    path('delete-application/<int:application_id>/', csrf_exempt(delete_application)),
    path('my-applications/', csrf_exempt(my_applications)),
    path('alerts/', csrf_exempt(recruiter_alerts)),
    path('alerts/<int:alert_id>/read/', csrf_exempt(mark_alert_read)),
]
