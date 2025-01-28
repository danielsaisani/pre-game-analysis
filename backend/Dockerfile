FROM python:3.11.7
WORKDIR /usr/local/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "-m", "pluto"]