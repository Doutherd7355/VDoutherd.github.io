<?php  if(isset($_POST['submit'])) {

if(trim($_POST['name']) == '') {
$hasError = true;
} else {
$name = trim($_POST['name']);
}

if(trim($_POST['subject']) == '') {
$hasError = true;
} else {
$subject = trim($_POST['subject']);
}


//Check to make sure sure that a valid email address is submitted
if(trim($_POST['email']) == '' && preg_match("/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/",$_POST['email']))  {
$hasError = true;
}  else {
$email = trim($_POST['email']);
}
if(trim($_POST['message']) == '') {
$hasError = true;
} else {
if(function_exists('stripslashes')) {
  $comments = stripslashes(trim($_POST['message']));
} else {
  $comments = trim($_POST['message']);
}
}

//----------------------Email Validation-----------------//
function EmVal($e)
{
  return preg_match("/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/",$e);
}


//If there is no error, send the email
if(!isset($hasError)) {
  $emailTo = 'doutherdv@gmail.com';
  $body = "Name: $name \n\nEmail: $email \n\nSubject: $subject \n\nComments:\n $comments";
  $headers = 'From: WebBestow <'.$emailTo.'>' . "\r\n" . 'Reply-To: ' . $email;

  mail($emailTo, $subject, $body, $headers);
  $emailSent = true;}


}
?>
