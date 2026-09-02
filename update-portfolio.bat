@echo off
cd /d "C:\Users\Juwain haque\dyad-apps\juwain-haque"

echo Updating Portfolio...
git add .
git commit -m "Update portfolio"
git push

echo.
echo Portfolio update pushed to GitHub!
pause
