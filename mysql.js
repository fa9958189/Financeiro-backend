const mysql =require("mysql");

var pool =mysql.createPool({
    "user":"355859",
    "password":"140204160401Fm",
    "database":"felipecriadorweb_banco",
    "host":"mysql-felipecriadorweb.alwaysdata.net",
    "port":3306

});

exports.pool=pool;