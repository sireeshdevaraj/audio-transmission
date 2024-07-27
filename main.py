from http.server import HTTPServer,SimpleHTTPRequestHandler
import ssl

local_ip = "..." # Get the local Ip with `ipconfig`, add the Ipv4
certificate_file_path = "..." # "C:\\Users\\Nerd_directory\\selfsigned.pem"
httpd = HTTPServer((local_ip, 8080), SimpleHTTPRequestHandler)

sslctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
sslctx.check_hostname = False # If set to True, only the hostname that matches the certificate will be accepted
sslctx.load_cert_chain(certfile=certificate_file_path)

httpd.socket = sslctx.wrap_socket(httpd.socket, server_side=True)
httpd.serve_forever()