<form action="change_password.php" method="post">
    <fieldset>
        <div class="form-group">
            <input autofocus class="form-control" name="password_old" placeholder="Old Password" type="password"/>
        </div>
        <div class="form-group">
            <input class="form-control" name="password_new" placeholder="New Password" type="password"/>
        </div>
        <div class="form-group">
            <input class="form-control" name="confirm" placeholder="Confirm New Password" type="password"/>
        </div>
        <div class="form-group">
            <button type="submit" class="btn btn-default">Change</button>
        </div>
    </fieldset>
</form>
