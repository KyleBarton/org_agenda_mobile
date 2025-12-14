#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Environment Setup & Verification...${NC}\n"

# --- iOS Setup ---
echo -e "${YELLOW}--- Checking iOS Setup ---${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v xcrun >/dev/null 2>&1; then
        echo -e "${GREEN}✓ Xcode tools found.${NC}"
        
        # Check for available simulators
        DEVICES=$(xcrun simctl list devices available | grep "iPhone")
        
        if [ -z "$DEVICES" ]; then
            echo -e "${RED}✗ No iPhone simulators found.${NC}"
            echo "Attempting to create a simulator..."
            # Try to find a runtime
            RUNTIME=$(xcrun simctl list runtimes | grep "iOS" | tail -n 1 | awk '{print $NF}')
            if [ -n "$RUNTIME" ]; then
                xcrun simctl create "iPhone 15" "iPhone 15" "$RUNTIME"
                echo -e "${GREEN}✓ Created 'iPhone 15' simulator.${NC}"
            else
                echo -e "${RED}✗ No iOS Runtimes found. Please open Xcode -> Settings -> Platforms and download an iOS Runtime.${NC}"
            fi
        else
            echo -e "${GREEN}✓ Found available iPhone simulators.${NC}"
            # Check if any is booted
            BOOTED=$(xcrun simctl list devices booted | grep "iPhone")
            if [ -z "$BOOTED" ]; then
                echo "No simulator is currently booted."
                # Get the UDID of the first available iPhone
                UDID=$(echo "$DEVICES" | head -n 1 | grep -oE '[0-9A-F-]{36}')
                echo "Booting simulator ($UDID)..."
                xcrun simctl boot "$UDID"
                open -a Simulator
                echo -e "${GREEN}✓ Simulator booted.${NC}"
            else
                echo -e "${GREEN}✓ A simulator is already booted.${NC}"
            fi
        fi
    else
        echo -e "${RED}✗ Xcode tools not found. Please install Xcode from the App Store.${NC}"
    fi
else
    echo "Skipping iOS setup (not on macOS)."
fi

echo ""

# --- Android Setup ---
echo -e "${YELLOW}--- Checking Android Setup ---${NC}"

# Try to find ANDROID_HOME
if [ -z "$ANDROID_HOME" ]; then
    if [ -d "$HOME/Library/Android/sdk" ]; then
        export ANDROID_HOME="$HOME/Library/Android/sdk"
        echo "Found Android SDK at $ANDROID_HOME"
    else
        echo -e "${RED}✗ ANDROID_HOME not set and could not be found automatically.${NC}"
        echo "Please install Android Studio and set ANDROID_HOME."
        exit 1
    fi
fi

EMULATOR_BIN="$ANDROID_HOME/emulator/emulator"
AVDMANAGER_BIN="$ANDROID_HOME/cmdline-tools/latest/bin/avdmanager"

if [ ! -f "$AVDMANAGER_BIN" ]; then
    # Try fallback path
    AVDMANAGER_BIN="$ANDROID_HOME/tools/bin/avdmanager"
fi

if [ -x "$EMULATOR_BIN" ]; then
    echo -e "${GREEN}✓ Android Emulator binary found.${NC}"
    
    AVDS=$($EMULATOR_BIN -list-avds)
    
    if [ -z "$AVDS" ]; then
        echo -e "${RED}✗ No Android Virtual Devices (AVDs) found.${NC}"
        echo "Attempting to create one..."
        
        # Check for system images
        if command -v sdkmanager >/dev/null 2>&1; then
             # This is tricky to automate due to licenses and large downloads.
             # We will check if we can list packages at least
             echo -e "${YELLOW}Creating an AVD automatically is complex due to licensing and downloads.${NC}"
             echo "Please run the following command manually to create an AVD:"
             echo "  avdmanager create avd -n 'Pixel_API_34' -k 'system-images;android-34;google_apis;x86_64' --device 'pixel'"
             echo ""
             echo "Note: You may need to install the system image first:"
             echo "  sdkmanager 'system-images;android-34;google_apis;x86_64'"
        else
             echo -e "${RED}✗ sdkmanager not found. Please open Android Studio -> Device Manager and create a device.${NC}"
        fi
    else
        echo -e "${GREEN}✓ Found AVDs:${NC}"
        echo "$AVDS"
        
        # Check if an emulator is already running
        if "$HOME/Library/Android/sdk/platform-tools/adb" devices | grep -q "emulator-"; then
             echo -e "${GREEN}✓ An emulator is already running.${NC}"
        else
             # Pick the first AVD
             FIRST_AVD=$(echo "$AVDS" | head -n 1)
             echo -e "${YELLOW}Launching emulator: $FIRST_AVD ...${NC}"
             
             # Launch in background
             "$EMULATOR_BIN" -avd "$FIRST_AVD" -netdelay none -netspeed full > /dev/null 2>&1 &
             
             echo -e "${GREEN}✓ Emulator launched in background.${NC}"
             echo "Waiting for boot to complete..."
             "$HOME/Library/Android/sdk/platform-tools/adb" wait-for-device
             echo -e "${GREEN}✓ Device ready!${NC}"
        fi
        
        echo ""
        echo "You can now run: npm run android" 
    fi
else
    echo -e "${RED}✗ Android Emulator binary not found at $EMULATOR_BIN${NC}"
    echo "Please install Android Studio and the Android SDK Command-line Tools."
fi

echo ""
echo -e "${GREEN}Setup check complete.${NC}"
