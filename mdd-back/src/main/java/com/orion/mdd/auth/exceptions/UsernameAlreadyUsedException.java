package com.orion.mdd.auth.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.orion.mdd.core.exceptions.ApiException;

@ResponseStatus(value = HttpStatus.CONFLICT, reason = "Username already used")
public class UsernameAlreadyUsedException extends ApiException {

    public UsernameAlreadyUsedException() {
        super();
    }

}
