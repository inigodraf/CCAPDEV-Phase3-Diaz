window.onload = function () {
    var usernameElement = document.getElementById('username');
    var nameInput = document.getElementById('name-input');
    var saveNameButton = document.getElementById('save-name-button');
    var profilePicInput = document.getElementById('profile-pic-input');
    var profilePicHeader = document.getElementById('profilePicHeader');
    var profilePic = document.getElementById('profile-pic');
    var alert = document.getElementById('alert');
    var cropper; 

    var savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        usernameElement.textContent = savedUsername;
        nameInput.value = savedUsername;
    }

    saveNameButton.addEventListener('click', function () {
        var newName = nameInput.value.trim();
        if (newName !== '') {
            usernameElement.textContent = newName;
            localStorage.setItem('username', newName);
        }
    });

    document.getElementById('change-profile-pic').addEventListener('click', function () {
        profilePicInput.click();
    });

    profilePicInput.addEventListener('change', function (e) {
        var file = e.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var dataURL = e.target.result;
                profilePic.src = dataURL;
                profilePicHeader.src = dataURL;
                alert.style.display = 'block';

                setTimeout(function () {
                    alert.style.display = 'none';
                }, 3000);

                localStorage.setItem('profilePicture', dataURL);
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('delete-profile-pic').addEventListener('click', function () {
        profilePic.src = 'default.jpg';
        profilePicHeader.src = 'default.jpg';
        profilePicInput.value = '';

        localStorage.removeItem('profilePicture');
    });

    profilePic.addEventListener('click', function () {
        var image = new Image();
        image.src = profilePic.src;
        image.onload = function () {
            var aspectRatio = this.width / this.height;
            var cropperOptions = {
                aspectRatio: aspectRatio,
                viewMode: 1,
                autoCropArea: 1,
                background: false,
                movable: false,
                zoomable: false,
                rotatable: false,
                scalable: false,
                crop: function (event) {
                    var canvas = cropper.getCroppedCanvas();
                    profilePic.src = canvas.toDataURL();
                    profilePicHeader.src = canvas.toDataURL();

                    localStorage.setItem('profilePicture', canvas.toDataURL());
                }
            };
            if (cropper) {
                cropper.destroy();
            }
            cropper = new Cropper(profilePic, cropperOptions);
        };
    });

    var savedProfilePicture = localStorage.getItem('profilePicture');
    if (savedProfilePicture) {
        profilePic.src = savedProfilePicture;
        profilePicHeader.src = savedProfilePicture;
    }
};