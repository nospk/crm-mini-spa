class HomePage {
    static async show(req, res) {
        res.render('home.ejs');
    }

}

module.exports = HomePage