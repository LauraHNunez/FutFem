from flask import Flask, render_template
import psycopg2

app = Flask(__name__)

# Configurar la conexión a la base de datos
conn = psycopg2.connect(database="GameFutFem", user="postgres", password="1234", host="localhost", port="5432")

# Ruta de inicio que consulta los datos de la base de datos y los muestra en una plantilla HTML
@app.route('/')
def index():
    cur = conn.cursor()
    cur.execute("SELECT * FROM quiz")
    rows = cur.fetchall()
    return render_template('app.html', rows=rows)

if __name__ == '__main__':
    app.run()
