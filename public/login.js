const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const signInForm = document.getElementById('signIn');
const signUPForm = document.getElementById('signup')

signUpButton.addEventListener('click',function(){
  signInForm.style.display= "none";
  signUPForm.style.display = "block";

})
signInButton.addEventListener('click',function(){
  signInForm.style.display = "block";
  signUPForm.style.display="none";
})