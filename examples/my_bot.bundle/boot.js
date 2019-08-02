const client = new br.Client();

client.connect('SNK citizendotexe');
client.on('connected', () => client.log('sucessfully connected'));
