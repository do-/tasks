const fs = require ('fs')
const {FilePathMaker} = require ('file-path-maker')
const TagProcessor = require ('string-replace-balanced')

module.exports = class extends TagProcessor {

    constructor (root) {

        super ()

		this.fpm = new FilePathMaker ({root})
	
		this.start = '"data:image/png;base64,'
	
		this.end = '"'		

	}

	transform (b64) {
	
		const fn = `${this.uuid}_${this.i ++}.png`, {rel, abs} = this.fpm.make (fn, 'task_notes')

		fs.writeFileSync (abs, b64, {encoding: 'base64'})

		return `"/_pics/${rel}"`

	}

	process (src, uuid) {

		this.uuid = uuid

		this.i = 0

		return super.process (src)

	}

}