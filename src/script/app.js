// * COMMENT CLASS
class Comment {
    // each object has properties like [user name, comment, unique serial, user image]
    constructor(name, text, sha, avatar) {
        this.name = name;
        this.text = text;
        this.sha = sha;
        this.avatar = avatar;
    }
}

// * USER INTERFACE CLASS which handles the dom
class UI {
    // ? START LAYER
    // removes the first layer you will see regardless the loader
    static removeLayer() {
        const layer = document.getElementById('name-layer');
        const nameInput = document.getElementById('user-name');
        const nameBtn = document.getElementById('ok');
        const error = document.getElementById('error');
        // if layer button is clicked
        nameBtn.addEventListener('click', function () {
            // if the name field is not empty and has no spaces then hide the layer
            if (nameInput.value !== '' && nameInput.value.trim() != '') {
                layer.style.display = 'none';
                document.querySelector('body').style.overflow = 'auto';
                // if not don't remove the layer and show an error - remove error after 1000ms
            } else {
                layer.style.display = 'grid';
                error.textContent = 'invalid name!';
                setTimeout(function () {
                    error.textContent = '';
                }, 1000);
            }
        });
    }
    // behaves as you clicked layer button
    static clickBtn() {
        const nameInput = document.getElementById('user-name');
        const nameBtn = document.getElementById('ok');
        nameInput.addEventListener('keyup', function (e) {
            // if enter key is pressed then act as layer button is clicked
            if (e.keyCode === 13) {
                nameBtn.click();
            }
        });
    }
    // ? END LAYER 

    // ? START DISPLAY COMMENTS
    // display old comments that come from the local storage and print them in the UI
    static displayComment() {
        // making an array which equal the one that comes from local storage
        let comments = Store.getComment();
        // looping through the array and initiate the add comment function and setting [com] as an argument
        comments.forEach((com) => {
            UI.addComment(com);
        });
    }
    // ? END DISPLAY COMMENTS

    // ? START ADD COMMENT
    // add comments to the dom 
    static addComment(com) {
        // selecting the element that we will append in it
        const section = document.querySelector('section');
        // creating the comments holder
        const div = document.createElement('div');
        // giving it a class so it can be recognized in css
        div.className = 'user';
        // appending in it the the html tags with object properties
        div.innerHTML = `
        <div class="user-img">
            <img src="${com.avatar}" alt="user">
        </div>

        <div class="user-comment">
            <p><span>${com.name}</span>${com.text}</p>
            <input type="hidden" class="sha" value="${com.sha}">
            <input type="hidden" class="store-last-com">
            <div>
                <input type="text" class="edit-input">
                <i>Press Esc to</i><a href="javascript:void(0)" class="esc">cancel</a>
            </div>
        </div>

        <div class="dropdown">
            <li class="li icon-ellipsis-h">
                <ul>
                    <li class="edit"><i class="edit-icon icon-pen"></i><span class="edit-text">edit...</span></li>
                    <li class="delete"><i class="delete-icon icon-trash"></i><span class="delete-text">delete...</span></li>
                </ul>
            </li>
        </div>

        <div class="confirm-layer">
        <div class="confirm-wrapper">
            <div class="confirm-text">
                <span>delete</span>
                <i class="ex icon-times"></i>
            </div>
            <p>Are you sure you want to delete this comment?</p>
            <div class="confirm-btns">
                <button type="button" class="del">delete</button>
                <button type="button" class="cancel">cancel</button>
            </div>
        </div>
        </div>
        `;
        // appending div in section
        section.appendChild(div);
    }
    // ? END ADD COMMENT

    // ? START GENERATE SHA
    // generate a unique serial key for each comment so we can track it when we need to delete or edit the comment from local storage
    static generateSha() {
        let sha = new Date().getTime();
        return sha;
    }
    // ? END GENERATE SHA

    // ? START REMOVE COMMENT
    // remove comment from UI on clicking delete button
    static removeComment(e) {
        // ! i had to target 3 classes cause iam using [e.target]
        let el = e.target.parentElement.parentElement.parentElement.parentElement;
        // ? trageting the element that has delete-text class
        if (e.target.classList.contains('delete-text')) {
            // layer variable is the container of the confirm process of deletion
            let layer = e.target.parentElement.parentElement.parentElement.parentElement.nextElementSibling;
            // hide comment menu if delete-text class is clicked 
            e.target.parentElement.parentElement.style.display = 'none';
            // display layer if the delete-text is clicked
            layer.style.display = 'grid';
            // delete button of the layer
            let del = layer.querySelector('.del');
            // x symbol of the layer
            let ex = layer.querySelector('.ex');
            // cancel button of the layer 
            let cancel = layer.querySelector('.cancel');
            // * after clicking delete-text class if del butotn clicked run the code inside 
            del.addEventListener('click', function () {
                // get the serial key of the targeted comment
                let sha = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.user-comment .sha').value;
                // remove comment container from dom
                el.parentElement.remove();
                // initiate removeComment of Store class and passing the sha as an argument
                Store.removeComment(sha);
                // initiate comments counter 
                UI.calcCom();
            });
            // * after clicking delete-text class if cancel button clicked run the code inside
            cancel.addEventListener('click', function () {
                // hide layer of confirm process of deletion
                layer.style.display = 'none';
            });
            // * after clicking delete-text class if x symbol button clicked run the code inside
            ex.addEventListener('click', function () {
                // hide layer of confirm process of deletion
                layer.style.display = 'none';
            });
        }

        // ? trageting the element that has delete-icon class
        if (e.target.classList.contains('delete-icon')) {
            let layer = e.target.parentElement.parentElement.parentElement.parentElement.nextElementSibling;
            e.target.parentElement.parentElement.style.display = 'none';
            layer.style.display = 'grid';
            let del = layer.querySelector('.del');
            let ex = layer.querySelector('.ex');
            let cancel = layer.querySelector('.cancel');
            del.addEventListener('click', function () {
                let sha = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.user-comment .sha').value;
                el.parentElement.remove();
                Store.removeComment(sha);
                UI.calcCom();
            });
            cancel.addEventListener('click', function () {
                layer.style.display = 'none';
            });
            ex.addEventListener('click', function () {
                layer.style.display = 'none';
            });
        }

        // ? trageting the element that has delete class
        if (e.target.classList.contains('delete')) {
            let layer = e.target.parentElement.parentElement.parentElement.nextElementSibling;
            e.target.parentElement.style.display = 'none';
            layer.style.display = 'grid';
            let del = layer.querySelector('.del');
            let ex = layer.querySelector('.ex');
            let cancel = layer.querySelector('.cancel');
            del.addEventListener('click', function () {
                let sha = e.target.parentElement.parentElement.parentElement.parentElement.querySelector('.user-comment .sha').value;
                el.remove();
                Store.removeComment(sha);
                UI.calcCom();
            });
            cancel.addEventListener('click', function () {
                layer.style.display = 'none';
            });
            ex.addEventListener('click', function () {
                layer.style.display = 'none';
            });
        }
    }
    // ? END REMOVE COMMENT

    // ? START EDIT COMMENT
    // edit comment from UI on clicking edit button
    static editComment(e) {
        // ! i had to target 3 classes cause iam using [e.target]
        // ? targeting the element that has edit-text class
        if (e.target.classList.contains('edit-text')) {
            // hide comment menu if edit-text class is clicked 
            e.target.parentElement.parentElement.style.display = 'none';
            // selecting p element which holds the username and usercomment
            let p = e.target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.querySelector('p');
            // selecting the serial key of that comment
            let sha = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.user-comment .sha').value;
            // selecting the hidden input of that comment which stores the previous comment in case we cancel editing 
            let hidden = e.target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.querySelector('.store-last-com');
            // selecting the div contains the edit input and cancel esc button
            let div = e.target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.querySelector('div');
            // selecting edit input in the above div
            let input = e.target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.querySelector('div .edit-input');
            // selecting esc button in the above div
            let esc = e.target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.querySelector('div a');
            // hide original comment
            p.style.display = 'none';
            // display edit input 
            div.style.display = 'block';
            // add focus to edit input
            input.focus();
            // copy original comment to hidden input so we can retrieve the last comment when we cancel the process
            hidden.value = p.lastChild.textContent;
            // copy original comment text to the edit input so we can edit right away
            input.value = p.lastChild.textContent;
            // listen to edit input
            input.addEventListener('keyup', function (e) {
                // instance editing to the current comment based on filling edit input
                p.lastChild.textContent = input.value;
                // save comment on pressing enter key
                if (e.keyCode === 13 && input.value !== '' && input.value.trim() != '') {
                    // display finished edited comment
                    p.style.display = 'block';
                    // hide div which contains edit input and esc button
                    div.style.display = 'none';
                    // initiate editComment of Store class and passing sha,p as arguments
                    Store.editComment(sha, p);
                }
                // cancel editing comment on pressing esc key
                if (e.keyCode === 27) {
                    esc.click();
                }
            });
            // listen to esc button
            esc.addEventListener('click', function () {
                // get the previous comment which stored in hidden input and put it in p tag
                p.lastChild.textContent = hidden.value;
                // display p which contains the comment
                p.style.display = 'block';
                // hide div which contains edit input and esc button
                div.style.display = 'none';
            });
        }

        // ? targeting the element that has edit-icon class
        if (e.target.classList.contains('edit-icon')) {
            e.target.parentElement.parentElement.style.display = 'none';
            let p = e.target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.querySelector('p');
            let sha = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('.user-comment .sha').value;
            let hidden = e.target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.querySelector('.store-last-com');
            let div = e.target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.querySelector('div');
            let input = e.target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.querySelector('div .edit-input');
            let esc = e.target.parentElement.parentElement.parentElement.parentElement.previousElementSibling.querySelector('div a');
            p.style.display = 'none';
            div.style.display = 'block';
            input.focus();
            hidden.value = p.lastChild.textContent;
            input.value = p.lastChild.textContent;
            input.addEventListener('keyup', function (e) {
                p.lastChild.textContent = input.value;
                if (e.keyCode === 13 && input.value !== '' && input.value.trim() != '') {
                    p.style.display = 'block';
                    div.style.display = 'none';
                    Store.editComment(sha, p);
                }
                if (e.keyCode === 27) {
                    esc.click();
                }
            });
            esc.addEventListener('click', function () {
                p.lastChild.textContent = hidden.value;
                p.style.display = 'block';
                div.style.display = 'none';
            });
        }

        // ? targeting the element that has edit class
        if (e.target.classList.contains('edit')) {
            e.target.parentElement.style.display = 'none';
            let p = e.target.parentElement.parentElement.parentElement.previousElementSibling.querySelector('p');
            let sha = e.target.parentElement.parentElement.parentElement.parentElement.querySelector('.user-comment .sha').value;
            let hidden = e.target.parentElement.parentElement.parentElement.previousElementSibling.querySelector('.store-last-com');
            let div = e.target.parentElement.parentElement.parentElement.previousElementSibling.querySelector('div');
            let input = e.target.parentElement.parentElement.parentElement.previousElementSibling.querySelector('div .edit-input');
            let esc = e.target.parentElement.parentElement.parentElement.previousElementSibling.querySelector('div a');
            p.style.display = 'none';
            div.style.display = 'block';
            input.focus();
            hidden.value = p.lastChild.textContent;
            input.value = p.lastChild.textContent;
            input.addEventListener('keyup', function (e) {
                p.lastChild.textContent = input.value;
                if (e.keyCode === 13 && input.value !== '' && input.value.trim() != '') {
                    p.style.display = 'block';
                    div.style.display = 'none';
                    Store.editComment(sha, p);
                }
                if (e.keyCode === 27) {
                    esc.click();
                }
            });
            esc.addEventListener('click', function () {
                p.lastChild.textContent = hidden.value;
                p.style.display = 'block';
                div.style.display = 'none';
            });
        }
    }
    // ? END EDIT COMMENT

    // ? START GLOBAL
    static global() {
        UI.avatarSrc = ['img/users/0.jpg', 'img/users/1.svg', 'img/users/2.svg', 'img/users/3.svg', 'img/users/4.svg', 'img/users/5.svg', 'img/users/6.svg', 'img/users/7.svg'];
        UI.src = 'img/users/0.jpg';
        UI.likeToggle = false;
    }
    // ? END GLOBAL

    // ? START AVATAR
    // avatar handles the user image
    static avatar() {
        // selecting name input
        const nameInput = document.getElementById('user-name');
        // selecting all 8 avatar images
        let img_0 = document.querySelector('._0');
        let img_1 = document.querySelector('._1');
        let img_2 = document.querySelector('._2');
        let img_3 = document.querySelector('._3');
        let img_4 = document.querySelector('._4');
        let img_5 = document.querySelector('._5');
        let img_6 = document.querySelector('._6');
        let img_7 = document.querySelector('._7');
        // listen to the avarar wrapper for click event
        document.querySelector('.avatar-wrapper').addEventListener('click', function (e) {
            // if the user clicked the avatar num 0 which has class _0 then run the code inside
            if (e.target.classList.contains('_0')) {
                // change the value of src variable to the location of the image that stored in the avararSrc array in index 0
                UI.src = UI.avatarSrc[0];
                // make the image no. zero highlighted and make the rest unhighlighted
                img_0.parentElement.style.background = '#4267b2';
                img_1.parentElement.style.background = 'transparent';
                img_2.parentElement.style.background = 'transparent';
                img_3.parentElement.style.background = 'transparent';
                img_4.parentElement.style.background = 'transparent';
                img_5.parentElement.style.background = 'transparent';
                img_6.parentElement.style.background = 'transparent';
                img_7.parentElement.style.background = 'transparent';
                // focus on the name input 
                nameInput.focus();
            }
            // doing the same as above code for the next avatar 
            if (e.target.classList.contains('_1')) {
                UI.src = UI.avatarSrc[1];
                img_0.parentElement.style.background = 'transparent';
                img_1.parentElement.style.background = '#4267b2';
                img_2.parentElement.style.background = 'transparent';
                img_3.parentElement.style.background = 'transparent';
                img_4.parentElement.style.background = 'transparent';
                img_5.parentElement.style.background = 'transparent';
                img_6.parentElement.style.background = 'transparent';
                img_7.parentElement.style.background = 'transparent';
                nameInput.focus();
            }
            if (e.target.classList.contains('_2')) {
                UI.src = UI.avatarSrc[2];
                img_0.parentElement.style.background = 'transparent';
                img_1.parentElement.style.background = 'transparent';
                img_2.parentElement.style.background = '#4267b2';
                img_3.parentElement.style.background = 'transparent';
                img_4.parentElement.style.background = 'transparent';
                img_5.parentElement.style.background = 'transparent';
                img_6.parentElement.style.background = 'transparent';
                img_7.parentElement.style.background = 'transparent';
                nameInput.focus();
            }
            if (e.target.classList.contains('_3')) {
                UI.src = UI.avatarSrc[3];
                img_0.parentElement.style.background = 'transparent';
                img_1.parentElement.style.background = 'transparent';
                img_2.parentElement.style.background = 'transparent';
                img_3.parentElement.style.background = '#4267b2';
                img_4.parentElement.style.background = 'transparent';
                img_5.parentElement.style.background = 'transparent';
                img_6.parentElement.style.background = 'transparent';
                img_7.parentElement.style.background = 'transparent';
                nameInput.focus();
            }
            if (e.target.classList.contains('_4')) {
                UI.src = UI.avatarSrc[4];
                img_0.parentElement.style.background = 'transparent';
                img_1.parentElement.style.background = 'transparent';
                img_2.parentElement.style.background = 'transparent';
                img_3.parentElement.style.background = 'transparent';
                img_4.parentElement.style.background = '#4267b2';
                img_5.parentElement.style.background = 'transparent';
                img_6.parentElement.style.background = 'transparent';
                img_7.parentElement.style.background = 'transparent';
                nameInput.focus();
            }
            if (e.target.classList.contains('_5')) {
                UI.src = UI.avatarSrc[5];
                img_0.parentElement.style.background = 'transparent';
                img_1.parentElement.style.background = 'transparent';
                img_2.parentElement.style.background = 'transparent';
                img_3.parentElement.style.background = 'transparent';
                img_4.parentElement.style.background = 'transparent';
                img_5.parentElement.style.background = '#4267b2';
                img_6.parentElement.style.background = 'transparent';
                img_7.parentElement.style.background = 'transparent';
                nameInput.focus();
            }
            if (e.target.classList.contains('_6')) {
                UI.src = UI.avatarSrc[6];
                img_0.parentElement.style.background = 'transparent';
                img_1.parentElement.style.background = 'transparent';
                img_2.parentElement.style.background = 'transparent';
                img_3.parentElement.style.background = 'transparent';
                img_4.parentElement.style.background = 'transparent';
                img_5.parentElement.style.background = 'transparent';
                img_6.parentElement.style.background = '#4267b2';
                img_7.parentElement.style.background = 'transparent';
                nameInput.focus();
            }
            if (e.target.classList.contains('_7')) {
                UI.src = UI.avatarSrc[7];
                img_0.parentElement.style.background = 'transparent';
                img_1.parentElement.style.background = 'transparent';
                img_2.parentElement.style.background = 'transparent';
                img_3.parentElement.style.background = 'transparent';
                img_4.parentElement.style.background = 'transparent';
                img_5.parentElement.style.background = 'transparent';
                img_6.parentElement.style.background = 'transparent';
                img_7.parentElement.style.background = '#4267b2';
                nameInput.focus();
            }
            // syncing the choosing avatar above with the image beside the comment input
            document.querySelector('footer .user-img img').setAttribute('src', UI.src);
        });
    }
    // ? END AVATAR

    // ? START CALC DATE
    // display how many years and months passed on the post
    static calcDate() {
        // selecting time container
        const el = document.querySelector('header aside i');
        // ! type the year you want here
        let year = 2018;
        // ! type the month you want here
        let month = 8;
        // date object stored in d variable
        let d = new Date();
        // * get how many years passed
        let x = d.getFullYear() - year;
        // convert year to month
        x *= 12;
        // * get how many months passed
        let y = d.getMonth() - month;
        // total years and months divided by 12 [decimal number]
        let decimal = (x + y) / 12;
        // get month number apart
        let m = (decimal % 1);
        // ? total years in rational number
        let finalYearNum = decimal - m;
        // ? total months in rational number
        let finalMonthNum = (m * 12).toFixed();
        // append text to the container
        if (finalYearNum == 0) {
            el.textContent = `${finalMonthNum} mo`;
        }
        if (finalMonthNum == 0) {
            el.textContent = `${finalYearNum} yr`;
        }
        if (finalMonthNum > 0 && finalYearNum > 0) {
            el.textContent = `${finalYearNum} yr, ${finalMonthNum} mo`;
        }
        if (finalMonthNum == 0 && finalYearNum == 0) {
            el.textContent = `Just Now`;
        }
    }
    // ? END CALC DATE

    // ? START CALC COMMENTS
    // counting how many comments in the UI
    static calcCom() {
        // selecting the comments number container
        let num = document.querySelector('.comments-num i');
        // selecting all comments
        let comNum = document.querySelectorAll('.user');
        // looping through the comments to get length which is the comments number
        comNum.forEach((item, index, array) => {
            // appeand the array length [comment number] in the comment container
            num.textContent = array.length;
        });
    }
    // ? END CALC COMMENTS

    // ? START COMMENT SOUND
    // add a sound when the user adds a comment
    static comSound() {
        let o = new Audio();
        o.src = 'sound/comment.mp3';
        o.play();
    }
    // ? END COMMENT SOUND

    // ? START FOCUS SOUND
    // add a sound when the user click a comment button
    static focusSound() {
        let o = new Audio();
        o.src = 'sound/focus.mp3';
        o.play();
    }
    // ? START FOCUS SOUND

    // ? START LIKE SOUND
    // add like sound when the user likes the post
    static likeSound() {
        let o = new Audio();
        o.src = 'sound/like.mp3';
        o.play();
    }
    // ? END LIKE SOUND

    // ? START LIKE  
    static like() {
        // add style to the like icon and font
        document.querySelector('.like i').style.color = '#2078f4';
        document.querySelector('.like span').style.color = '#2078f4';
        // initiate like sound 
        UI.likeSound();
    }
    // ? END LIKE

    // ? START UNLIKE  
    static unlike() {
        // add style to the unlike icon and font
        document.querySelector('.like i').style.color = '#606770';
        document.querySelector('.like span').style.color = '#606770';
    }
    // ? START UNLIKE  

    // ? START FOCUS INPUT 
    static focusInput() {
        document.querySelector('#user-comment').focus();
    }
    // ? END FOCUS INPUT 

    // ? START CLEAR INPUTS 
    static clearInput() {
        document.querySelector('#user-comment').value = '';
    }
    // ? END CLEAR INPUTS

    // ? START FIXED COMMENTS
    static fixedComments() {
        // remove menu of fixed comments
        document.querySelector('input[value="00100"]').parentElement.nextElementSibling.querySelector('.li').remove();
        document.querySelector('input[value="00200"]').parentElement.nextElementSibling.querySelector('.li').remove();
        document.querySelector('input[value="00300"]').parentElement.nextElementSibling.querySelector('.li').remove();
        // remove layer of fixed comments
        document.querySelector('input[value="00100"]').parentElement.nextElementSibling.nextElementSibling.remove();
        document.querySelector('input[value="00200"]').parentElement.nextElementSibling.nextElementSibling.remove();
        document.querySelector('input[value="00300"]').parentElement.nextElementSibling.nextElementSibling.remove();
    }
    // ? END FIXED COMMENTS
}

// * STORE CLASS which handles the local storage
class Store {
    // ? START GET COMMENT 
    // checking the local storage 
    static getComment() {
        // define a variable
        let comments;
        // if the local storage has a [comments] key which is empty then run the code inside
        if (localStorage.getItem('comments') === null) {
            // add fixed comments to the defined variable in sort of array of objects
            comments = [{
                    name: 'Pashatheboss',
                    text: 'Legend ❤️',
                    avatar: 'img/users/pasha.jpg',
                    sha: '00100'
                },
                {
                    name: 'Thebartlife',
                    text: 'Sick!!!',
                    avatar: 'img/users/bart.jpg',
                    sha: '00200'
                },
                {
                    name: 'Dimitris_dk_kyrsanidis',
                    text: 'You are floating bro!! Great power!! Impressive!!🙌🙌😃',
                    avatar: 'img/users/dk.jpg',
                    sha: '00300'
                }
            ];
            // if the local storage has key of comments then run the code inside
        } else {
            // get values of comments key in local storage and assign them to the defined variable after parsing them
            comments = JSON.parse(localStorage.getItem('comments'));
        }
        // return the defined variable
        return comments;
    }
    // ? END GET COMMENT 

    // ? START ADD COMMENT 
    static addComment(com) {
        // get a copy of the array in the local storage
        let comments = Store.getComment();
        // pushing [com: instance of the comment class] an object in the array
        comments.push(com);
        // setting the local storage with the updated array after stringifing it
        localStorage.setItem('comments', JSON.stringify(comments));
    }
    // ? END ADD COMMENT 

    // ? START REMOVE COMMENT
    static removeComment(sha) {
        // get a copy of the array in the local storage
        let comments = Store.getComment();
        // looping through the array 
        comments.forEach((com, index) => {
            // comparing the sha of array with dom
            if (com.sha == sha) {
                // if it's equal then splice that object [which contains the sha] of the array
                comments.splice(index, 1);
            }
        });
        // setting the local storage with the updated array after stringifing it
        localStorage.setItem('comments', JSON.stringify(comments));
    }
    // ? END REMOVE COMMENT

    // ? START EDIT COMMENT
    static editComment(sha, p) {
        // get a copy of the array in the local storage
        let comments = Store.getComment();
        // looping through the array 
        comments.forEach((com) => {
            // comparing the sha of array with dom
            if (com.sha == sha) {
                // if it's equal then assign that property of object [which contains the sha] with the dom content
                com.text = p.lastChild.textContent;
            }
        });
        // setting the local storage with the updated array after stringifing it
        localStorage.setItem('comments', JSON.stringify(comments));
    }
    // ? END EDIT COMMENT

    // ? START GET LIKE
    // checking the local storage
    static getLike() {
        // define a variable
        let likeNum;
        // if the local storage has a [likes] key which is empty then run the code inside
        if (localStorage.getItem('likes') === null) {
            // add fixed number of likes to defined variable to start with
            likeNum = 3;
        }
        // if the local storage has key of comments then run the code inside
        else {
            // get value of likes key in local storage and assign it to the defined variable after parsing it
            likeNum = JSON.parse(localStorage.getItem('likes'));
        }
        // return the defined variable
        return likeNum;
    }
    // ? END GET LIKE

    // ? START LIKE
    static like() {
        // get a copy of the number in the local storage
        let likeNum = Store.getLike();
        // increase the number by one
        likeNum++;
        // append it to the like container
        let likesCon = document.querySelector('.likes-num i');
        likesCon.textContent = likeNum;
        // setting the local storage with the updated number after stringifing it
        localStorage.setItem('likes', JSON.stringify(likeNum));
    }
    // ? END LIKE

    // ? START UNLIKE
    static unlike() {
        // get a copy of the number in the local storage
        let likeNum = Store.getLike();
        // decrease the number by one
        likeNum--;
        // append it to the like container
        let likesCon = document.querySelector('.likes-num i');
        likesCon.textContent = likeNum;
        // setting the local storage with the updated number after stringifing it
        localStorage.setItem('likes', JSON.stringify(likeNum));
    }
    // ? END UNLIKE
}

// * INITIATE FUNCTIONS ON DOMContentLoaded EVENT
document.addEventListener('DOMContentLoaded', function () {
    // initiate remove layer 
    UI.removeLayer();
    // initiate clickbtn
    UI.clickBtn();
    // initiate display comment
    UI.displayComment();
    // initiate calc comments
    UI.calcCom();
    // initiate calc date 
    UI.calcDate();
    // initiate avatar
    UI.avatar();
    // initiate fixed comments
    UI.fixedComments();
    // copy likes number from local storage and append it in the likes container 
    let likesCon = document.querySelector('.likes-num i');
    likesCon.textContent = Store.getLike();
    // initiate global
    UI.global();
});

// * ADD COMMENT ON submit EVENT
document.querySelector('#form').addEventListener('submit', function (e) {
    // prevent default behavior
    e.preventDefault();
    // selecting the comment input 
    let text = document.querySelector('#user-comment').value;
    // if the comment input isn't empty and had no spaces then run the code inside
    if (text.length > 0 && text.trim() != '') {
        // get name input value
        let name = document.querySelector('#user-name').value;
        // get the random serial key and initiate generatSha 
        let sha = UI.generateSha();
        // get the avatar location
        let avatar = UI.src;
        // instantiate the Comment class 
        let com = new Comment(name, text, sha, avatar);
        // initiate addComment of UI
        UI.addComment(com);
        // initiate addComment of Store
        Store.addComment(com);
        // initiate calculate comments 
        UI.calcCom();
        // initiate comment sound
        UI.comSound();
        // initiate clear input
        UI.clearInput();
    }
});

// * REMOVE COMMENT ON click EVENT
document.querySelector('section').addEventListener('click', function (e) {
    // initiate removeComment
    UI.removeComment(e);
});

// * EDIT COMMENT ON click EVENT
document.querySelector('section').addEventListener('click', function (e) {
    // initiate editComment
    UI.editComment(e);
});

// * COMMENT INPUT FOCUS ON click EVENT
document.querySelector('.btns .comment').addEventListener('click', function () {
    // initiate focus input
    UI.focusInput();
    // initiate focus sound
    UI.focusSound();
});

// * LIKE OR UNLIKE ON click EVENT
document.querySelector('.like').addEventListener('click', function () {
    // if it's true run the code inside
    if (UI.likeToggle) {
        // initiate unlike of UI
        UI.unlike();
        // initiate unlike of Store
        Store.unlike();
        UI.likeToggle = false;
    }
    // if likeToggle is false run code inside
    else {
        // initiate like of UI
        UI.like();
        // initiate like of Store
        Store.like();
        UI.likeToggle = true;
    }
});

// * SHOW MENU ON click EVENT
document.querySelector('section').addEventListener('click', function (e) {
    // if the targeted element has class of li then run the code inside
    if (e.target.classList.contains('li')) {
        // selecting the ul to be hide or show
        let ul = e.target.querySelector('ul');
        // if the ul is displayed none then run the code inside
        if (ul.style.display == '' || ul.style.display == 'none') {
            // set ul to be displayed as block
            ul.style.display = 'block';
        }
        // if the ul is displayed blocke the run the code inside
        else {
            // set ul to be displayed as none
            ul.style.display = 'none';
        }
    }
});

// * PREVENT RIGHT CLICK ON contextmenu EVENT
document.addEventListener('contextmenu', function (e) {
    // prevent default behavior
    // e.preventDefault();
});