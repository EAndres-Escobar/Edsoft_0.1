import logging
import os
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
from flask_mysqldb import MySQL
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from passlib.context import CryptContext
from email.message import EmailMessage
import ssl
import smtplib

app = Flask(__name__)
CORS(app)

CORS(app, resources={r"/*": {"origins": "*"}})

load_dotenv()

# Configuración de la base de datos MySQL
app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
app.config['MYSQL_PORT'] = int(os.getenv('MYSQL_PORT'))
app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')

mysql = MySQL(app)


# Configuración de logging
logging.basicConfig(level=logging.DEBUG)

# ruta para cargar los datos del login


contexto = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Ruta para cargar los datos del login


@app.route('/login', methods=['POST'])
def login():
    credentials = request.json
    nombres = credentials['nombres']
    idUsuario = credentials['idUsuario']
    passwordE = credentials['passwordE']

    # Conectar a la base de datos MySQL y verificar las credenciales
    cursor = mysql.connection.cursor()

    cursor.execute(
        'SELECT nombres, idUsuario, passwordE FROM empleados WHERE nombres = %s AND idUsuario = %s', (nombres, idUsuario))
    user = cursor.fetchone()

    # Verificar la contraseña utilizando el contexto de Passlib
    stored_password_hash = user[2]  #

    try:
        stored_password_hash_bytes = stored_password_hash.encode('utf-8')

        if contexto.verify(passwordE, stored_password_hash_bytes):
            cursor.close()
            return jsonify({'message': 'Inicio de sesión exitoso'}), 200
        else:
            raise ValueError("Contraseña incorrecta")
    except ValueError as e:
        cursor.close()
        app.logger.info(f'Credenciales inválidas: {e}')
        return jsonify({'message': 'Credenciales inválidas'}), 401


# Ruta para agregar un nuevo cliente
@app.route('/clientes', methods=['POST'])
def agregar_cliente():
    cliente = request.json
    nombres = cliente['nombres']
    apellidos = cliente['apellidos']
    documentoid = cliente['documentoid']
    email = cliente['email']
    celular = cliente['celular']
    fecha = cliente['fecha']

    # Conectar a la base de datos MySQL y agregar el cliente
    cursor = mysql.connection.cursor()

    cursor.execute('INSERT INTO clientes (nombres, apellidos, documentoid, email, celular, fecha) VALUES (%s, %s, %s, %s, %s, %s)',
                   (nombres, apellidos, documentoid, email, celular, fecha))

    mysql.connection.commit()
    cursor.close()

    app.logger.info('Cliente agregado correctamente')
    return jsonify({'message': 'Cliente agregado correctamente'}), 200


# Ruta para buscar clientes por documento y nombre
@app.route('/clientes/buscar', methods=['GET'])
def buscar_clientes():
    documento = request.args.get('documentoid')
    nombre = request.args.get('nombres')

    app.logger.info(
        f'Parámetros de búsqueda: Documento={documento}, Nombre={nombre}')

    # Conectar a la base de datos MySQL y buscar clientes
    cursor = mysql.connection.cursor()

    if documento and nombre:
        cursor.execute(
            'SELECT id_clientes, nombres, apellidos, documentoid, email, celular FROM clientes WHERE documentoid = %s AND nombres = %s', (documento, nombre))
    elif documento:
        cursor.execute(
            'SELECT id_clientes, nombres, apellidos, documentoid, email, celular FROM clientes WHERE documentoid = %s', (documento,))
    elif nombre:
        cursor.execute(
            'SELECT id_clientes, nombres, apellidos, documentoid, email, celular FROM clientes WHERE nombres = %s', (nombre,))
    else:
        app.logger.error(
            'Ingrese al menos un parámetro de búsqueda (documento o nombre)')
        return jsonify({'message': 'Ingrese al menos un parámetro de búsqueda (documento o nombre)'}), 400

    clientes = cursor.fetchall()
    cursor.close()

    app.logger.info(f'Clientes encontrados')

    return jsonify({'clientes': clientes}), 200

# eliminar clientes de la base de datos 
@app.route('/clientes/<int:cliente_id>', methods=['DELETE'])
def eliminar_cliente(cliente_id):
    # Conectar a la base de datos MySQL y buscar el cliente por ID
    cursor = mysql.connection.cursor()

    cursor.execute(
        'SELECT * FROM clientes WHERE id_clientes = %s', (cliente_id,))
    cliente = cursor.fetchone()

    if not cliente:
        cursor.close()
        app.logger.error(f'Cliente con ID {cliente_id} no encontrado')
        return jsonify({'message': f'Cliente con ID {cliente_id} no encontrado'}), 404

    # Eliminar el cliente de la base de datos
    cursor.execute(
        'DELETE FROM clientes WHERE id_clientes = %s', (cliente_id,))
    mysql.connection.commit()
    cursor.close()

    app.logger.info(f'Cliente con ID {cliente_id} eliminado correctamente')
    return jsonify({'message': f'Cliente con ID {cliente_id} eliminado correctamente'}), 200


# Ruta para agregar un nuevo proveedor
@app.route('/proveedores', methods=['POST'])
def agregar_proveedores():
    proveedores = request.json
    nombres = proveedores['nombres']
    apellidos = proveedores['apellidos']
    documentoid = proveedores['documentoid']
    email = proveedores['email']
    celular = proveedores['celular']
    fecha = proveedores['fecha']

    # Conectar a la base de datos MySQL y agregar el proveedor
    cursor = mysql.connection.cursor()

    cursor.execute('INSERT INTO proveedores (nombres, apellidos, documentoid, email, celular, fecha) VALUES (%s, %s, %s, %s, %s, %s)',
                   (nombres, apellidos, documentoid, email, celular, fecha))

    mysql.connection.commit()
    cursor.close()

    app.logger.info('Proveedor agregado correctamente')
    return jsonify({'message': 'Proveedor agregado correctamente'}), 200


# Ruta para buscar Proveedor por documento y nombre
@app.route('/proveedores/buscar', methods=['GET'])
def buscar_proveedores():
    documento = request.args.get('documentoid')
    nombre = request.args.get('nombres')

    app.logger.info(
        f'Parámetros de búsqueda: Documento={documento}, Nombre={nombre}')

    # Conectar a la base de datos MySQL y buscar proveedores
    cursor = mysql.connection.cursor()

    if documento and nombre:
        cursor.execute(
            'SELECT id_proveedores, nombres, apellidos, documentoid, email, celular FROM proveedores WHERE documentoid = %s AND nombres = %s', (documento, nombre))
    elif documento:
        cursor.execute(
            'SELECT id_proveedores, nombres, apellidos, documentoid, email, celular FROM proveedores WHERE documentoid = %s', (documento,))
    elif nombre:
        cursor.execute(
            'SELECT id_proveedores, nombres, apellidos, documentoid, email, celular FROM proveedores WHERE nombres = %s', (nombre,))
    else:
        app.logger.error(
            'Ingrese al menos un parámetro de búsqueda (documento o nombre)')
        return jsonify({'message': 'Ingrese al menos un parámetro de búsqueda (documento o nombre)'}), 400

    proveedores = cursor.fetchall()
    cursor.close()

    app.logger.info(f'Proveedores encontrados:')

    return jsonify({'proveedores': proveedores}), 200

# Ruta para eliminar proveedor por ID
@app.route('/proveedores/<int:proveedor_id>', methods=['DELETE'])
def eliminar_proveedor(proveedor_id):
    # Conectar a la base de datos MySQL y eliminar el proveedor
    cursor = mysql.connection.cursor()

    cursor.execute('DELETE FROM proveedores WHERE id_proveedores = %s', (proveedor_id,))

    mysql.connection.commit()
    cursor.close()

    app.logger.info(f'Proveedor con ID {proveedor_id} eliminado correctamente')
    return jsonify({'message': f'Proveedor con ID {proveedor_id} eliminado correctamente'}), 200

# Buscar los empleados registrados en la base de datos
@app.route('/empleados/buscar', methods=['GET'])
def buscar_empleados():
    documento = request.args.get('documentoid')
    nombre = request.args.get('nombres')

    app.logger.info(
        f'Parámetros de búsqueda: Documento={documento}, Nombre={nombre}')

    # Conectar a la base de datos MySQL y buscar
    cursor = mysql.connection.cursor()

    if documento and nombre:
        cursor.execute(
            'SELECT documentoid, nombres, apellidos, documentoid, email, celular FROM empleados WHERE documentoid = %s AND nombres = %s', (documento, nombre))
    elif documento:
        cursor.execute(
            'SELECT documentoid, nombres, apellidos, documentoid, email, celular FROM empleados WHERE documentoid = %s', (documento,))
    elif nombre:
        cursor.execute(
            'SELECT documentoid, nombres, apellidos, documentoid, email, celular FROM empleados WHERE nombres = %s', (nombre,))
    else:
        app.logger.error(
            'Ingrese al menos un parámetro de búsqueda (documento o nombre)')
        return jsonify({'message': 'Ingrese al menos un parámetro de búsqueda (documento o nombre)'}), 400

    empleados = cursor.fetchall()
    cursor.close()
    app.logger.info(f'empleados encontrados:')

    return jsonify({'empleados': empleados}), 200


# buscar empleados dentro de facturar
@app.route('/empleados/buscar/facturar', methods=['GET'])
def buscar_empleados_facturar():
    documentoid = request.args.get('documentoid')

    app.logger.info(f'Parámetros de búsqueda: Documento={documentoid}')

    # Conectar a la base de datos MySQL y buscar empleados
    cursor = mysql.connection.cursor()

    if documentoid:
        cursor.execute(
            'SELECT documentoid, nombres, apellidos FROM empleados WHERE documentoid = %s', (documentoid,))
        empleados = cursor.fetchall()
        cursor.close()

        app.logger.info(f'Empleados encontrados: {empleados}')

        empleados_list = [{'documentoid': emp[0], 'nombres': emp[1],
                           'apellidos': emp[2]} for emp in empleados]

        return jsonify({'empleados': empleados_list}), 200


# buscar los clientes dentro de facturar
@app.route('/clientes/buscar/facturar', methods=['GET'])
def buscar_clientes_facturar():
    documentoid = request.args.get('documentoid')

    app.logger.info(f'Parámetros de búsqueda: Documento={documentoid}')

    # Conectar a la base de datos MySQL y buscar empleados
    cursor = mysql.connection.cursor()

    if documentoid:
        cursor.execute(
            'SELECT documentoid, nombres, apellidos FROM clientes WHERE documentoid = %s', (documentoid,))
        clientes = cursor.fetchall()
        cursor.close()

        app.logger.info(f'Clientes encontrados: {clientes}')

        # Asegúrate de devolver una lista de diccionarios con los nombres de las columnas
        clientes_list = [{'documentoid': emp[0], 'nombres': emp[1],
                          'apellidos': emp[2]} for emp in clientes]

        return jsonify({'clientes': clientes_list}), 200

    # buscar para facturar los productos


# buscar los productos dentro de facturar
@app.route('/inventario/buscar/facturar', methods=['GET'])
def buscar_inventario_facturar():
    try:
        codigoP = request.args.get('codigoP')

        app.logger.info(f'Parámetros de búsqueda: codigoP')

        # Conectar a la base de datos MySQL y buscar productos
        cursor = mysql.connection.cursor()

        if codigoP:
            cursor.execute(
                'SELECT codigoP, nombreProducto, laboratorio, precioVenta FROM inventario WHERE codigoP = %s', (codigoP,))
            inventario = cursor.fetchall()
            cursor.close()

            app.logger.info(f'Productos encontrados: {inventario}')

            inventario_list = [{'codigoP': prod[0], 'nombreProducto': prod[1],
                                'laboratorio': prod[2], 'precioVenta': prod[3]} for prod in inventario]

            return jsonify({'Inventario': inventario_list}), 200
        else:
            return jsonify({'message': 'Código de producto no proporcionado'}), 400
    except Exception as e:
        app.logger.error(f'Error en la búsqueda de inventario: {e}')
        return jsonify({'message': 'Error en la búsqueda de inventario'}), 500

# registrar el cierre diario


@app.route('/cierre_diario', methods=['POST'])
def cierre_caja():
    caja = request.json
    efectivo_inicial = caja['efectivo_inicial']
    ventas_efectivo = caja['ventas_efectivo']
    ventas_tarjeta = caja['ventas_tarjeta']
    gasto = caja['gasto']
    nombre_usuario = caja['nombre_usuario']
    fecha = caja['fecha']
    nombre_gastos = caja['nombre_gastos']

    cursor = mysql.connection.cursor()

    cursor.execute('INSERT INTO caja (efectivo_inicial, ventas_efectivo, ventas_tarjeta, gasto, nombre_usuario, fecha, nombre_gastos) VALUES (%s, %s, %s, %s, %s, %s, %s)',
                   (efectivo_inicial, ventas_efectivo, ventas_tarjeta, gasto, nombre_usuario, fecha, nombre_gastos))

    mysql.connection.commit()
    cursor.close()

    app.logger.info('cierre de caja agregado correctamente')
    return jsonify({'message': 'cierre de caja agregado correctamente'}), 200

# listar empleados dentro de Cierre diario


@app.route('/empleados/buscar/cierre', methods=['GET'])
def buscar_empleados_cierre():
    # Conectar a la base de datos MySQL y buscar
    cursor = mysql.connection.cursor()

    # Modificación: seleccionar solo los nombres y apellidos de todos los empleados
    cursor.execute('SELECT nombres, apellidos FROM empleados')

    # Construir una lista de diccionarios con los nombres completos de los empleados
    empleados = [{'nombre_completo': f"{nombres} {apellidos}"}
                 for nombres, apellidos in cursor.fetchall()]
    cursor.close()

    # Devolver la lista de empleados como JSON
    return jsonify({'empleados': empleados}), 200


# buscar cierre diario realizado
@app.route('/cierre_diario/buscar', methods=['GET'])
def buscar_cierre_diario():
    nombre_usuario = request.args.get('nombre_usuario')
    app.logger.info(f'Parámetros de búsqueda: nombre_usuario={nombre_usuario}')

    # Conectar a la base de datos MySQL y buscar cierre diario
    cursor = mysql.connection.cursor()

    if nombre_usuario:
        cursor.execute(
            'SELECT  efectivo_inicial, ventas_efectivo, ventas_tarjeta, nombre_gastos, gasto, nombre_usuario , fecha FROM caja WHERE nombre_usuario = %s', (nombre_usuario,))
        caja = cursor.fetchall()
        cursor.close()
        app.logger.info(f'Cierre diario encontrado')
        return jsonify({'caja': caja}), 200
    else:
        app.logger.error(
            'Ingrese el nombre de usuario para realizar la búsqueda')
        return jsonify({'message': 'Ingrese el nombre de usuario para búsqueda'}), 400

    # cargar productos para el inventario


@app.route('/inventario/buscar', methods=['GET'])
def buscar_inventario():
    codigoP = request.args.get('codigoP')
    nombreProducto = request.args.get('nombreProducto')
    app.logger.info(
        f'Parámetros de búsqueda: codigoP={codigoP}, nombreProducto={nombreProducto}')

    # Conectar a la base de datos MySQL y buscar
    cursor = mysql.connection.cursor()

    if codigoP and nombreProducto:
        cursor.execute(
            'SELECT codigoP, nombreProducto, fechaVencimiento, laboratorio, lote, registroSanitario, precioVenta, fechaIngreso, Stock FROM inventario WHERE codigoP = %s AND nombreProducto = %s', (codigoP, nombreProducto))
    elif codigoP:
        cursor.execute(
            'SELECT codigoP, nombreProducto, fechaVencimiento, laboratorio, lote, registroSanitario, precioVenta, fechaIngreso, Stock FROM inventario WHERE codigoP = %s', (codigoP,))
    elif nombreProducto:
        cursor.execute(
            'SELECT codigoP, nombreProducto, fechaVencimiento, laboratorio, lote, registroSanitario, precioVenta, fechaIngreso, Stock FROM inventario WHERE nombreProducto = %s', (nombreProducto,))
    else:
        app.logger.error(
            'Ingrese al menos un parámetro de búsqueda (documento o nombre)')
        return jsonify({'message': 'Ingrese al menos un parámetro de búsqueda (documento o nombre)'}), 400

    inventario = cursor.fetchall()
    cursor.close()
    app.logger.info(f'inventario encontrado')

    if inventario:
        return jsonify({'inventario': inventario}), 200
    else:
        return jsonify({'message': 'No se encontraron resultados'}), 404


# buscar los productos para el inventario
@app.route('/inventario/nombres', methods=['GET'])
def obtener_nombres_productos():
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT DISTINCT nombreProducto FROM inventario")
        nombres = cur.fetchall()
        cur.close()
        return jsonify({'nombres': [nombre[0] for nombre in nombres]})
    except Exception as e:
        logging.error(f"Error al obtener nombres de productos: {e}")
        return jsonify({'error': str(e)}), 500

    # codigo para guardar las facturas en la base de datos

# Ruta para servir los archivos PDF


@app.route('/ruta/del/servidor/archivos/pdf/<filename>')
def descargar_pdf(filename):
    return send_from_directory('C:/xampp/htdocs/facturas', filename)

# Ruta para agregar una factura


@app.route('/facturas', methods=['POST'])
def agregar_factura():
    try:
        codigo_factura = request.form['codigoFactura']
        fecha = request.form['fecha']

        archivo_pdf = request.files['facturaPdf']
        if archivo_pdf:
            filename = secure_filename(archivo_pdf.filename)
            archivo_pdf.save(os.path.join(
                'C:/xampp/htdocs/facturas', filename))
        else:
            return jsonify({"mensaje": "Archivo PDF de factura no proporcionado"}), 400

        # Insertar factura en la base de datos
        cursor = mysql.connection.cursor()
        cursor.execute(
            "INSERT INTO facturas (codigoFactura, facturaPdf, fecha) VALUES (%s, %s, %s)",
            (codigo_factura, filename, fecha)
        )
        mysql.connection.commit()
        cursor.close()

        return jsonify({"mensaje": "Factura agregada con éxito"}), 200

    except Exception as e:
        logging.error(f"Error al agregar factura: {str(e)}")
        return jsonify({"mensaje": "Error al agregar factura"}), 500

# Ruta para buscar una factura por código


@app.route('/facturas/buscar', methods=['GET'])
def buscar_factura():
    try:
        codigo_factura = request.args.get('codigoFactura')

        cursor = mysql.connection.cursor()
        cursor.execute(
            "SELECT codigoFactura, facturaPdf, fecha FROM facturas WHERE codigoFactura = %s",
            (codigo_factura,)
        )
        facturas_encontradas = cursor.fetchall()
        cursor.close()

        return jsonify({"facturas": facturas_encontradas}), 200

    except Exception as e:
        logging.error(f"Error al buscar factura: {str(e)}")
        return jsonify({"mensaje": "Error al buscar factura"}), 500

    # API para la recuperación de contraseña y usuario
load_dotenv()


@app.route('/sendmail', methods=['POST'])
def sendmail():
    data = request.get_json()

    email_sender = os.getenv('EMAIL_SENDER')
    password = os.getenv("EMAIL_PASSWORD")
    email_reciver = os.getenv('EMAIL_RECIVER')

    subjet = "Recuperar contraseña"
    body = f"Hola mi Nombre es {data['name']} {data['apellido']},\n\nAquí están los detalles para recuperar la contraseña :\nNombre: {data['name']}\nApellido: {data['apellido']}\nCorreo: {data['email']}\nDocumento: {data['documento']}"

    em = EmailMessage()
    em["From"] = email_sender
    em["To"] = email_reciver
    em["Subject"] = subjet
    em.set_content(body)

    context = ssl.create_default_context()

    with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
        smtp.starttls(context=context)
        smtp.login(email_sender, password)
        smtp.sendmail(email_sender, email_reciver, em.as_string())

    return {"message": "Email sent successfully"}


if __name__ == '__main__':
    app.run(debug=True)
