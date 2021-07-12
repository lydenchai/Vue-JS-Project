new Vue({
    el:'#root',
    data: {
        img: '',
        text : '',
        getId : '',
        userName :'',
        getName : '',
        update : true,
        showFormLogin : true,
        allList: []        
    },

    methods: {
        // function upload image
        upload_img(e) {
            let create_img = e.target.files[0]
            console.log(create_img)
            this.createBase64Image(create_img)
        },

        createBase64Image(fileObject) {
            let reader = new FileReader()
            reader.onload = (e) => {
                this.img = e.target.result

                console.log(reader.result)
                localStorage.setItem('img', reader.result)
            }
            reader.readAsDataURL(fileObject)
        },
        post() {
            this.text = ''
        },

        // Login button. After user input name and click login button it will go to home page and user can post
        btnLogin(){
            localStorage.setItem( 'userName', this.userName);
            userName = '';
            if (this.userName !== '' ){
                this.showFormLogin = false
            }  
        },

        // Logout button. When user click on butoon logout it will back to login page
        btnLogout () {
            this.showFormLogin = true; 
            this.userName = ''; 
            localStorage.clear();
        },

        // Delete post
        remove (list) {
            let id = list.id;
            window.axios.delete('http://localhost:3000/post/' +id ).then( res =>{
                this.allList = res.data;
            });
        },

        // Edit posted
        edit (list) { 
            //  Call all old data for update
            this.getId = list.id;
            this.text = list.content;
            this.getName = list.name;
            this.image = list.img;
            this.update = false;

        },

        // upload new text or content after user edit
        updateText(){
            // Date and time 
            let today = new Date();
            let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            let date =  today.getDate() + ' ' +  months[today.getMonth()] + ' ' + today.getFullYear();
            let time = today.getHours() + ':' + today.getMinutes();
            let dateTime = date + ', ' + time;

            // All data user updated
            let data = {
                id : this.getId,
                name : this.getName,
                date : dateTime,
                text : this.text,
                image : this.img
            };

            axios.put('http://localhost:3000/post/' + this.getId, data).then(res =>{
                this.allList = res.data;
            });

            // update is true when user click on button update 
            this.update = true;

            // Clear text 
            this.text = '';

        },

        // Post when user input text or something else already then click on post button
        addLists () {
            let getLogcal = localStorage.getItem("img")
            // date and time 
            let today = new Date();
            let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            let date =  today.getDate() + ' ' +  months[today.getMonth()] + ' ' + today.getFullYear();
            let time = today.getHours() + ':' + today.getMinutes();
            let dateTime = date + ', ' + time;

            // data that user post
            let data = {
                name : localStorage.getItem('userName'),
                date : dateTime,
                text : this.text,
                img : getLogcal
            };

            if (this.text !== " " && this.img !== " "){
                axios.post('http://localhost:3000/post', data).then( (res) => {
                    this.allList = res.data;
                });
            };
            
            // Clear everything after user click on post button 
            this.text = '';

        }
    },

    mounted () {
        // username will store in localStorag. And when we clear username form localStorage it will load to Login page 
        if(localStorage.getItem('userName')!==null){
            this.showFormLogin = false;
            this.userName = localStorage.getItem("userName");
            axios.get('http://localhost:3000/post').then((res) => {
                this.allList = res.data;
            });
        };
    }
})