import { http } from '@/utils/http';

class ApiService {
    async getChat(from, to, skip) {
        return await http.get(`/api/GetChat?from=${from}&to=${to}&skip=${skip}`);
    }

    async addFriend({userId, friendId}){
        return await http.post('/api/addfriend', {
            userId,
            friendId
          });
    }
    async getUserFriendsWithMessages(userId){
        return await http.get(`/api/GetUserFriendsWithMessages?userId=${userId}`);
    }
    async sendMessage({ from, to, messageText }) {
        return await http.post('/api/addmessage', {
            from,
            to,
            messageText
          });
    }
    async getPotentialFriends(userId) {
        return await http.get(`/api/getusers?userId=${userId}`);
    }

}
export const apiService = new ApiService();
