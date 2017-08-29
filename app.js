const dotenv = require('dotenv');
const Telegraf = require('telegraf');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const moment = require('moment');

dotenv.config({ path: 'variables.env' });

const app = new Telegraf(process.env.BOT_TOKEN);
app.command('start', ({ from, reply }) => {
  return reply('Bem vindo!');
});

// app.hears('dia', (ctx) => ctx.reply('Hey there!'));
// app.on('sticker', (ctx) => ctx.reply('👍'));

app.command('/dia', ({ reply }) => {
	// Tenta conectar ao banco de dados
	MongoClient.connect(process.env.DB_URL, function(err, db) {
		if (err) {
			reply('Erro ao recuperar relatório diário');
			db.close();
			return;
		}
		else {
			const submissoes = db.collection('submissoes');
			
			// Acha todas as submissões feitas com a data >= o dia atual
			submissoes.find({
				data: { $gte: new Date(moment().format('YYYY-MM-DD')) }
			}).toArray(function(err, docs) {
				if (err) {
					reply('Erro ao recuperar relatório diário');
					return;
				}
				else {
					if (docs.length === 1) {
						reply(`Houve ${docs.length} submissão hoje.`);
					}
					else {
						reply(`Houveram ${docs.length} submissões hoje.`);
					}
				}
				db.close();
			});
			return;
		}
	  });
});

app.startPolling();