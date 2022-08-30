#!/bin/bash

#ENV
PROVIDER="${CODECOV_PROVIDER:-gh}"
TEAM="${CODECOV_TEAM:-your_team}"
PROJECT="${CODECOV_PROJECT:-your_project}"
MAX_ERROR_DETECTION_TIME=120 #seconds
TIMEOUT=240 #seconds
RETRY_INTERVAL=25 #seconds

TOKEN="${CODECOV_API_TOKEN:-your_api_token}"
COMMIT_ID="${COMMIT_SHA}"
MINIMUM_COVERAGE=95

#URL
URL=https://codecov.io/api/$PROVIDER/$TEAM/$PROJECT/commits/$COMMIT_ID

echo url: $URL

## FUNCTIONS

fetchDataProcessingState() { # params: elapsedTime
  FDPS_eTime=$1
  # results data contain property commit
  FDPS_hasCommit=$(echo $results | jq 'has("commit")') # using global results var
  # Error if parsing failed
  if [ $? -ne 0 ]; then
    echo "error"
    return 101
  fi

  if [ "$FDPS_hasCommit" == true ]; then
    FDPS_state=$(echo $results | jq -r '.commit.state')

    if [ "$FDPS_state" == "complete" ]; then
      echo "complete" # used has return value
      return 0
    elif [ $FDPS_eTime -ge $MAX_ERROR_DETECTION_TIME ]; then
      echo "error"
      return 1
    fi
  fi

  #assume pending
  echo "pending"
  return 0
}

## MAIN

# curl, awk and jq must be installed
echo fetching codecov results....

start=$SECONDS
end=$(($SECONDS+$TIMEOUT))

## loop till data available
while : ; do
  elapsed=$(($SECONDS-$start))
  #echo "Elapsed time $elapsed"

  results=$(curl -s -H "Authorization: $CODECOV_API_TOKEN" $URL)
  #echo results: $results

  processingState=$(fetchDataProcessingState $elapsed)
  # Exit if parsing failed
  if [ $? -eq 101 ]; then
    echo "Received bad data from server, please check your inputs."
    exit 1
  fi

  if [ "$processingState" == "complete" ]; then
    break
  elif [ "$processingState" == "error" ]; then
    echo "Failed to process the commit"
    exit 1
  fi

  if [ $SECONDS -ge $end ]; then
    echo "The process timed out. Could not get commit data"
    exit 1
  fi

  sleep $RETRY_INTERVAL
done

coverage=$(echo $results | jq -r '.commit.totals.c')


#echo COVERAGE: $coverage
coverageIsOk=$(awk  "BEGIN { c1 = $coverage; c2 = $MINIMUM_COVERAGE; (c1 >= c2) ? res = 1 : res = 0; print res}")

if [ "$coverageIsOk" -eq "1" ]; then
  echo Good coverage: $coverage
  exit 0
else
  echo Low coverage: "$coverage < $MINIMUM_COVERAGE"
  exit 1
fi
