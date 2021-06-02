import Api from './Api'

export default{
    all(query,limit,offset)
    {
        return Api.get(`/branches?q=${query}&limit=${limit}&offset=${offset}`)
    }
}