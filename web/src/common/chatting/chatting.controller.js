class ChattingCtrl {
    constructor($scope, ChatRoom, Socket) {
        this.$scope = $scope;
        this.ChatRoom = ChatRoom;
        this.Socket = Socket;
    }

    $onInit() {
        this.socket = new this.Socket();
        this.chatRoom = new this.ChatRoom();

        this.state = 'BeforeEntry';
        this.memberMaxCount = '-';
        this.memberName = null;

        this.chatRoom.init().then(() => {
            this.$scope.$broadcast('SCROLL');
            this.$scope.$broadcast('FOCUS');
        });

        this.socket
            .connect()
            .listen('listen/update_member_num', (message) => {
                const memberNumber = message.results.member_num;
                this.memberMaxCount = memberNumber;
                this.$scope.$apply();
            })
            .listen('listen/new_comment', (message) => {
                this.chatRoom.addChat(message.results);
                this.$scope.$broadcast('SCROLL');
                this.$scope.$apply();
            });
    }

    $onDestroy() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    enterChatRoom(memberName) {
        this.state = 'Entrance';
        this.memberName = memberName;
    }
}

ChattingCtrl.$inject = ['$scope', 'ChatRoom', 'Socket'];

export default ChattingCtrl;
