import request from "../utils/request"

export function queryUsers(id) {
    return request("/api/users", {
        method: "GET"
    })
}