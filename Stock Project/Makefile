.PHONY: be fe dev logs test clean

be:
	. venv/bin/activate 2>/dev/null || python -m venv venv && . venv/bin/activate; \
	pip install -r requirements.txt; \
	python manage.py runserver 0.0.0.0:8000

fe:
	cd frontend && npm i && npm run dev

dev:
	@echo "Start Django on :8000 and Next on :3000 in two terminals:"
	@echo " make be   # backend"
	@echo " make fe   # frontend"

logs:
	mkdir -p logs && touch logs/django_app.log logs/access.log && tail -f logs/*.log

test:
	pytest -q

clean:
	rm -rf **/__pycache__ .pytest_cache
