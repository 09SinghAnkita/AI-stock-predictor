import json, time, uuid, logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger("access.json")

class JsonAccessLog(MiddlewareMixin):
    def process_request(self, request):
        request._req_id = str(uuid.uuid4())
        request._ts =  time.time()

    def process_response(self,request,response):

        try:
            duration_ms = int((time.time()-getattr(request,"_ts",time.time()))*1000)
            log={
                "req_id":getattr(request,"_req_id","-"),
                "path":getattr(request,"path","-"),
                "method":getattr(request,"method","-"),
                "req_id":getattr(request,"_req_id","-"),
                "status_code":getattr(request,"status_code","0"),
                "ttft_ms":getattr(request,"_ttft_ms","-"),
                "duration_ms":duration_ms,
            }
            logger.info(json.dumps(log,ensure_ascii=False))

        except Exception as e:
            logger.error(json.dumps({"log_error":str(e)}))
        return response         
