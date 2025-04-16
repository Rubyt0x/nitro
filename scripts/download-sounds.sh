#!/bin/bash

# Create sounds directory if it doesn't exist
mkdir -p public/sounds

# Download sounds
echo "Downloading sounds..."

# Spin sound - mechanical reels with upbeat background
curl -L "https://assets.mixkit.co/active_storage/sfx/2672/2672-preview.mp3" -o public/sounds/spin.mp3

# Win sounds - more exciting variations
curl -L "https://assets.mixkit.co/active_storage/sfx/2673/2673-preview.mp3" -o public/sounds/winAxe.mp3
curl -L "https://assets.mixkit.co/active_storage/sfx/2674/2674-preview.mp3" -o public/sounds/winBell.mp3
curl -L "https://assets.mixkit.co/active_storage/sfx/2675/2675-preview.mp3" -o public/sounds/winBomb.mp3
curl -L "https://assets.mixkit.co/active_storage/sfx/2676/2676-preview.mp3" -o public/sounds/winCar.mp3
curl -L "https://assets.mixkit.co/active_storage/sfx/2677/2677-preview.mp3" -o public/sounds/winDouble.mp3
curl -L "https://assets.mixkit.co/active_storage/sfx/2678/2678-preview.mp3" -o public/sounds/winFuel.mp3
curl -L "https://assets.mixkit.co/active_storage/sfx/2679/2679-preview.mp3" -o public/sounds/winSingle.mp3
curl -L "https://assets.mixkit.co/active_storage/sfx/2680/2680-preview.mp3" -o public/sounds/winTriple.mp3
curl -L "https://assets.mixkit.co/active_storage/sfx/2681/2681-preview.mp3" -o public/sounds/jackpot.mp3
curl -L "https://assets.mixkit.co/active_storage/sfx/2682/2682-preview.mp3" -o public/sounds/win.mp3
curl -L "https://assets.mixkit.co/active_storage/sfx/2683/2683-preview.mp3" -o public/sounds/win7.mp3
curl -L "https://assets.mixkit.co/active_storage/sfx/2686/2686-preview.mp3" -o public/sounds/winFire.mp3

# Button click sound - satisfying click
curl -L "https://assets.mixkit.co/active_storage/sfx/2684/2684-preview.mp3" -o public/sounds/button.mp3

# Game over sound - gentle reminder
curl -L "https://assets.mixkit.co/active_storage/sfx/2685/2685-preview.mp3" -o public/sounds/gameOver.mp3

echo "Sounds downloaded successfully!"

# Make the script executable
chmod +x scripts/download-sounds.sh 