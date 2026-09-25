const ImageKit = require('@imagekit/nodejs')

const imagekit = new ImageKit({
    privateKey:"private_azm2Yi0q0Oqww7pBALbR9r0wn7o="
})

async function uploadFile(buffer){
    const result = await imagekit.files.upload({
        file:buffer.toString("base64"),
        fileName:"image.jpg"
    })
    return result;
}

module.exports = uploadFile;