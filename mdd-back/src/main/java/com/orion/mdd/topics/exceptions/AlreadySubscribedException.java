package com.orion.mdd.topics.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.orion.mdd.core.exceptions.ApiException;

@ResponseStatus(value = HttpStatus.CONFLICT, reason = "Already subscribed to this topic")
public class AlreadySubscribedException extends ApiException {

    public AlreadySubscribedException() {
        super();
    }

}
