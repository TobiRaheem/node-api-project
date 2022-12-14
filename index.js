const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

//SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/starter/templates/overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/starter/templates/template-card.html`,
  "utf-8"
);
const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  "utf-8"
);
const dataObj = JSON.parse(data);

//The above code is considered 'top level code' as it is rendered before the call back function below. Once a user browses to the URL this
//will be rendered immediately and will not needed to be rendered again when browsing different domains which is good programming practice.

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHTML = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);
    res.end(output);

    //PRODUCT PAGE
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    let output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    //NOT FOUND
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listen to requests on port 8000");
});
