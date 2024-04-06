FROM python:3.11-slim

WORKDIR /usr/src

COPY ./app/requirements.txt .

RUN pip install -r requirements.txt

COPY ./app/ .

CMD ["uvicorn", "myapi:app", "--reload", "--host", "0.0.0.0"]

EXPOSE 8000
