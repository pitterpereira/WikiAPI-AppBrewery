//Inicializações dos pacotes npm
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

//Permite a utilização do express
const app = express();

//Permite a utilização do EJS
app.set('view engine', 'ejs');

//Permite a utilização do Body-Parser
app.use(bodyParser.urlencoded({
    extended: true
}));

//Permite que o express enxergue a pasta public
app.use(express.static("public"));

//Conecta com o banco de dados que está no programa Robo3t
mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true
});

//Cria o esquema do banco
const articleSchema = {
    title: String,
    content: String
};

//Cria o modelo
const Article = mongoose.model("Article", articleSchema);

//Tudo abaixo segue o modelo RESTful, utilizando os HTTP verbs GET, POST, PUT, PATCH e DELETE

// Requests Targetting all Articles //

//Roteamento do Express que permite reduzir código.
app.route("/articles") //Todos os métodos depois desta linha, se referem a esta rota

//app.get("/articles", function(req, res){...}); antes era assim, depois fica assim:

//Ao entrar na página, recebe todos os artigos criados (select all)
.get(function(req, res) {
    //Realiza a pesquisa
    Article.find(function(err, foundArticles) {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
})

//Cria um novo artigo através de um post
.post(function(req, res) {
    //Informações recebidas pelo post são ineridas em um artigo
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    //Artigo é salvo
    newArticle.save(function(err) {
        if (!err) {
            res.send("Successfully added a new article.");
        } else {
            res.send(err);
        }
    });
})

//Deleta todos os artigos da coleção articles
.delete(function(req, res) {
    //Deleta tudo
    Article.deleteMany(function(err) {
        if (!err) {
            res.send("Successfully deleted all articles.");
        } else {
            res.send(err);
        }
    });
});

// Requests Targetting A Specific Article //

//Roteamento do Express que permite reduzir código.
app.route("/articles/:articleTitle") //Todos os métodos depois desta linha, se referem a esta rota

//Tenta entrar num artigo digitado na URL, após articles/
.get(function(req, res) {
    //Procura pelo artigo digitado na url
    Article.findOne({ title: req.params.articleTitle }, function(err, foundArticle) {
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No articles matching that title was found.");
        }
    });
})

//Substituir dados em um documento, substituindo tudo
.put(function(req, res) {
    //Realiza o update no documento
    Article.update({ title: req.params.articleTitle }, {
            title: req.body.title,
            content: req.body.content
        }, { overwrite: true },
        function(err) {
            if (!err) {
                res.send("Successfully updated the selected article.");
            }
        }
    );
})

//Substituir dados em um documento, substitundo trecho específico
.patch(function(req, res) {
    //Realiza o update no documento
    Article.update({ title: req.params.articleTitle }, { $set: req.body },
        function(err) {
            if (!err) {
                res.send("Successfully updated article.");
            } else {
                res.send(err);
            }
        }
    );
})

//Deleta artigo específico
.delete(function(req, res) {
    //Deleta o artigo
    Article.deleteOne({ title: req.params.articleTitle },
        function(err) {
            if (!err) {
                res.send("Successfully deleted the corresponding article.");
            } else {
                res.send(err);
            }
        }
    );
});

//Inicialização do servidor
app.listen(3000, function() {
    console.log("Server started on port 3000");
});