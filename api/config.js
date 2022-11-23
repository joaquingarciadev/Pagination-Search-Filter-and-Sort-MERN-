process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
let URL_DB = "";
if (process.env.NODE_ENV === 'dev') {
    URL_DB = "mongodb://mongo:CnJde9YUZY9wwLRps0g2@containers-us-west-68.railway.app:7430";
} else {
    URL_DB = ""
};
process.env.URL_DB = URL_DB;
