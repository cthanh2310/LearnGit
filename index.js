const { response } = require('express');
var express = require('express');
var app = express();
app.use(express.static('public'));
app.set('view engine','ejs');
app.set("views","./views");
app.listen(3000);
var bodyParser = require('body-parser')

var urlencodedParser = bodyParser.urlencoded({ extended: false })



const pg = require('pg');

var config = {
    user: 'postgres',
    database: 'students',
    password: 'admin',
    host: 'localhost',
    post : '5432',
    max: 10,
    idleTimeoutMillis:  30000,
};
const pool = new pg.Pool(config);

app.get("/sinhvien/list",function(req, res){
    pool.connect(function(err, client, done){
        if(err){
            return console.log('Error : ', err);
        }
        client.query('SELECT * FROM sinhvien order by id asc', function(err, result){
// Done() to release the client back to the pool
            done();
            
            if(err){
                res.end();
                return console.log('Error running query', err);
            }
            // console.log(result.rows[2].email);
            res.render("sinhvien_list.ejs",{
                danhsach:result
            });
        });
    }); // Lay database
   
});
app.get("/sinhvien/them", function(req, res){
    res.render("sinhvien_insert.ejs")
}) // Show form website mà khách hàng thêm

app.post("/sinhvien/them",urlencodedParser, function(req, res){
    // var hoten = req.body.txtHoTen;
    // var email = req.body.txtEmail; // Đem vào pool.connect vì đây chạy đồng thời, đem vào đảm bảo được connect thành công đã rồi mới chạy
    pool.connect(function(err, client, done){
        if(err){
            return console.log('Error : ', err);
        }
        var hoten = req.body.txtHoTen;
        var email = req.body.txtEmail;
        client.query(`insert into sinhvien(hoten, email) values('${hoten}', '${email}')`, function(err, result){
// Done() to release the client back to the pool
            done();
            
            if(err){
                res.end();
                return console.log('Error running query', err);
            }
            // console.log(result.rows[0].hoten);
            res.send("INSERT THANH CONG");
        });
    });
}); // Insert database
app.get("/sinhvien/sua/:id", function(req, res){
    
    pool.connect(function(err, client, done){
        if(err){
            return console.log('Error : ', err);
        }
        var id = req.params.id;
        client.query(`SELECT * FROM sinhvien WHERE id ='${id}'`, function(err, result){
// Done() to release the client back to the pool
            done();
            
            if(err){
                res.end();
                return console.log('Error running query', err);
            }
            // console.log(result.rows[0].hoten);
            // console.log(result.rows[0]); In ra rows[0] vì chỉ có 1 phần tử được lấy ra nên ở vị trí 0
            res.render("sinhvien_edit.ejs",{

                sv:result.rows[0]
            });
        });
    }); // Lay database



});
app.post("/sinhvien/sua", urlencodedParser, function(req, res){
    pool.connect(function(err, client, done){
        if(err){
            return console.log('Error : ', err);
        }
        var hoten = req.body.txtHoTen;
        var email = req.body.txtEmail;
        var id = req.body.txtId;
        client.query(`UPDATE sinhvien SET hoten='${hoten}', email = '${email}' WHERE id= '${id}'`, function(err, result){
// Done() to release the client back to the pool
            done();
            
            if(err){
                res.end();
                return console.log('Error running query', err);
            }
            // console.log(result.rows[0].hoten);
            res.redirect("/sinhvien/list");
            
            
        });
    });
});
app.get("/sinhvien/xoa/:id", function(request, response){
    
    pool.connect(function(err, client, done){
        if(err){
            return console.log('Error : ', err);
        }
        var id = req.params.id;
        client.query(`DELETE FROM sinhvien WHERE id = '${id}'`, function(err, result){
// Done() to release the client back to the pool
            done();
            
            if(err){
                res.end();
                return console.log('Error running query', err);
            }
            // console.log(result.rows[0].hoten);
            // console.log(result.rows[0]); In ra rows[0] vì chỉ có 1 phần tử được lấy ra nên ở vị trí 0
            res.redirect("/sinhvien/list");

        });
    }); // Lay database

});
// qua de
// hello đây là 1 chương trình nodejs của Thành đây nè 

// Day la code cua Thanh moi hom nay




app.get("/",function(req,res){
    res.render("main");
});
