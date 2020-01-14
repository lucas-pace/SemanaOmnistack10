const axios = require('axios')
const Dev = require('../models/Dev')
const parseStringAsArray = require('../utils/parseStringAsArray')
module.exports = {

    async index (request,response){
        const devs = await Dev.find()

        return response.json(devs)
    },
    async store(request, response) {
        const { username, techs, latitude, longitude } = request.body

        let dev = await Dev.findOne({ username })

        if (!dev) {
            const responseGit = await axios.get(`https://api.github.com/users/${username}`)
            const { name = login, avatar_url, bio } = responseGit.data



            const techsArray = parseStringAsArray(techs)

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }


            dev = await Dev.create({
                name,
                username: username,
                bio,
                avatar: avatar_url,
                techs: techsArray,
                location
            })
        }
        return response.json(dev)
    }
}