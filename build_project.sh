#!/bin/bash

. /home/eraz/Documents/Perso/ShellScript/prompt.bash



DEFAULT_COMMAND_OPTION="build";
COMMAND_OPTION=(
    "build"
    "localPackage"
    "publishPackage"
);
DEFAULT_VERSION_MODIFIER_OPTION="Patch";
VERSION_MODIFIER_OPTION=(
    "Major"
    "Minor"
    "Patch"
);

FOLDER_OF_BUILD="dist";
FOLDER_LOCAL_PACKAGE="localPackage";

#! Transform an array into a string with each of the array element
#! @param $1	array: array of element
#! @param $2	separator
function from_array_options_to_string_options()
{
    result="";

    for element in "${@}"; 
    do
        result+="$element;";
    done

    # Remove the last semicolon
    result=${result:0:${#result}-1};

    echo $result;
}

#! Generate a npm local package that can be linked to other project without being published
#! @param $1	package_name: name of the package that will be generated
function generate_local_package()
{
    if [ -d ./$FOLDER_OF_BUILD ]
    then
        rm -rf ./$FOLDER_OF_BUILD;
        build_package;

        if [ $? -eq 0 ]
        then
            if [ -d ./$FOLDER_LOCAL_PACKAGE ]
            then
                rm -rf ./$FOLDER_LOCAL_PACKAGE;
            fi

            npm pack;
            tar -xvf eraz-react-components-*.tgz;
            rm ./eraz-react-components-*.tgz;
            mv ./package ./$FOLDER_LOCAL_PACKAGE;
        fi
    else
        build_package;

        if [ $? -eq 0 ]
        then

            if [ -d ./$FOLDER_LOCAL_PACKAGE ]
            then
                rm -rf ./$FOLDER_LOCAL_PACKAGE;
            fi

            npm pack;
            tar -xvf eraz-react-components-*.tgz;
            rm ./eraz-react-components-*.tgz;
            rm -rf ./$FOLDER_OF_BUILD;
            mv ./package ./localPackage;
        fi
    fi
}

#! Publish a npm package
function publish_package()
{
    #! Increment the version number for the new publish
    function Incerment_package_version()
    {
        local prompt_version_modification_result="";
        # Read the current version number from the package.json file
        local current_version=$(grep '"version":' package.json | awk -F: '{ print $2 }' | sed 's/[",]//g');
        local new_version="";

        # Move the cursor up 8 lines (number of line of the precedent menu) and clear them
        tput cuu 8
        tput el

        echo "The actual version of package is v.${current_version/#*[[:space:]]}";

        prompt_select prompt_version_modification_result $(from_array_options_to_string_options "${VERSION_MODIFIER_OPTION[@]}") $DEFAULT_VERSION_MODIFIER_OPTION;

        if   [ $prompt_version_modification_result == "Major" ]; then new_version=$(echo $current_version | awk -F. '{ printf("%s.%s.%s\n", $1+1, $2, $3) }');
        elif [ $prompt_version_modification_result == "Minor" ]; then new_version=$(echo $current_version | awk -F. '{ printf("%s.%s.%s\n", $1, $2+1, $3) }');
        elif [ $prompt_version_modification_result == "Patch" ]; then new_version=$(echo $current_version | awk -F. '{ printf("%s.%s.%s\n", $1, $2, $3+1) }');
        fi

        # Update the version number in the package.json file
        sed -i "s/\"version\": \"$current_version\"/\"version\": \"$new_version\"/g" package.json;
    }

    if [ -d "./dist" ]
    then
        rm -rf ./$FOLDER_OF_BUILD;
        build_package;

        if [ $? -eq 0 ]
        then
            Incerment_package_version;
            npm publish;
        fi
    else
        build_package;

        if [ $? -eq 0 ]
        then
            Incerment_package_version;
            npm publish;
            rm -rf ./$FOLDER_OF_BUILD;
        fi
    fi
}

function build_package()
{
    if [ -d "./dist" ]
    then
        rm -rf ./dist;
    fi    

    webpack;

    if [ $? -ne 0 ]
    then
        rm -rf ./dist;
        return 1;
    fi

    return 0;
}


prompt_command_selection_result="";

prompt_select prompt_command_selection_result $(from_array_options_to_string_options "${COMMAND_OPTION[@]}") $DEFAULT_COMMAND_OPTION;

if [ "$prompt_command_selection_result" == "build" ];            then build_package;
elif [ "$prompt_command_selection_result" == "localPackage" ];   then generate_local_package;
elif [ "$prompt_command_selection_result" == "publishPackage" ]; then publish_package;
fi
