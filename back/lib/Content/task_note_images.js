const fs = require ('fs')

module.exports = {

////////////////////////////////////////////////////////////////////////////////

do_create_task_note_images: 

    async function () {

		let rq = this.rq

		let root = this.conf.pics
		
		fs.mkdirSync (root + rq.path.substr (0, 11), {recursive: true})
		
		let fn = root + rq.path
		
        return new Promise ((ok, fail) => {

            fs.writeFile (fn, Buffer.from (rq.img, 'base64'), (err) => {
                
                if (err) return fail (err)
                
                darn ('wrote ' + fn)
                
                ok (fn)

            })
        
        })

    },	

}