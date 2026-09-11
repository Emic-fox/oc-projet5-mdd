package com.orion.mdd.topics.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.orion.mdd.core.exceptions.ApiException;

@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Not subscribed to this topic")
public class NotSubscribedException extends ApiException {

    public NotSubscribedException() {
        super();
    }

}
