from celery import shared_task

@shared_task
def print_hello(name):
    print(f"Hello {name} from Celery!")
    return f"Hello {name} printed"
