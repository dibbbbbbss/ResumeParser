from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from recruit.views import parse_resume,parse_jd,get_parsed_data,get_parsedjd_data,get_ranked_resume,get_job_data,get_job_detail
app_name="recruit"
urlpatterns = [
    
    path('resumeparser/',csrf_exempt(parse_resume)),
    path('jdparser/',csrf_exempt(parse_jd)),
    path('get-parsed-data/',csrf_exempt(get_parsed_data)),
    path('get-parsedjd-data/',csrf_exempt(get_parsedjd_data)),
    path('get-job-data/',csrf_exempt(get_job_data)),
    path('get-job-detail/<int:job_id>/',csrf_exempt(get_job_detail)),
    path('get-ranked-resume/<int:job_desc_id>/',csrf_exempt(get_ranked_resume)),
]
