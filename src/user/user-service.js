const UserModel = require('./user-model')
const userRepository = require('./user-repository')

const save = userRepository.save

const findById = async (id) => {
    return userRepository.findById(id)
}

const create = async (user) => {
    if (user.id) return user
    
    return userRepository.save(new UserModel(user))
}

const register = async (user, subscrption) => {
    user.webSubscription = subscrption

    return userRepository.save(user)
}

const subscribe = async (userId, animeId) => {
    const user = await userRepository.findById(userId)

    user.animeToNotify.push(animeId)
    user.animeToNotify = [...new Set(user.animeToNotify)]

    return await userRepository.save(user)
}

const unsubscribe = async (userId, animeId) => {
    const user = await userRepository.findById(userId)

    user.animeToNotify = user.animeToNotify.filter(id => id != animeId)    

    return userRepository.save(user)
}

const findByAnimeToNotify = async (animeId) => {
    return UserModel.find({ animeToNotify : { $in : [animeId] } })
}

module.exports = {
    save,
    create,
    subscribe,
    unsubscribe,
    findById,
    register,
    findByAnimeToNotify
}