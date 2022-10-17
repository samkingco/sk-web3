#!/bin/bash
# Generates d.ts files for ABI JSON output, and saves them in src/abis

SRC_CONTRACTS="${PWD%/*}/contracts/src"
ABI_INPUT="${PWD%/*}/contracts/out"
ABI_OUTPUT="${PWD}/src/abis"

SOL_PATTERN="*.*sol"
ABI_PATTERN="*.abi.*json"
DECL_POSTFIX=".d.ts"

# Ensure the output directory exists
mkdir -p $ABI_OUTPUT

# Remove existing declaration files
rm $ABI_OUTPUT/*.*

# Get the ABI JSON files from contracts/out/
ABI_JSON_FILES=($(find $ABI_INPUT -type f -iname "$ABI_PATTERN"))

# Get the contract src files
SRC_CONTRACT_NAMES=($(find $SRC_CONTRACTS -type f -iname "*.sol"))

# Loop over the ABIs
for abi in "${ABI_JSON_FILES[@]}"
do
  # Get the base contract name from the ABI
  ABI_NAME=$(basename "${abi}" .abi.json)

  # Loop over the contract src files
  for contract in "${SRC_CONTRACT_NAMES[@]}"
  do
    # Get the base contract name from the src file
    CONTRACT_NAME=$(basename "${contract}" .sol)
    
    # If the ABI and contract name match, then we know it's a contract from
    # our src directory, not a dependency or test
    if [ "$ABI_NAME" = "$CONTRACT_NAME" ]; then
        # Create our d.ts file with the JSON contents of the ABI
        text=$(cat $abi)
        printf "declare const data: $(echo ${text})\nexport = data" > "$ABI_OUTPUT/$ABI_NAME.d.ts"
    fi
  done
done