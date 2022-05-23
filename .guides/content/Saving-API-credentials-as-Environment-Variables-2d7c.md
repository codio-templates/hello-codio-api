##

1. The `.bashrc` file is open in `nano` on the left. Scroll using the scroll wheel on your mouse or the arrow keys until the very end.

2. Add the following two lines at the very end, including the client and secret IDs you created (see previous page for more details):

    ```
    export CLIENT=[variable_value]
    export SECRET=[variable_value]
    ```
    *Note:* Please copy and paste the client and secret values to avoid typos!

3. Press `ctrl` or `command` + `x` to exit

4. When prompted if you want to save, press `y` and then Enter/Return

5. Run the file so the environments are set for **this** terminal session: `source ~/.bashrc`

This project will now remember your API credentials as environment variables!

{Go to List of Examples| go-to-section-titled}(List of Examples)