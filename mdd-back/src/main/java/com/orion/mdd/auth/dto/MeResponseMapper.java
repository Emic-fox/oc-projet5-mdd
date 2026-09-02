package com.orion.mdd.auth.dto;

import org.mapstruct.Mapper;

import com.orion.mdd.users.User;

@Mapper(componentModel = "spring")
public interface MeResponseMapper {

    MeResponse toMeResponse(User user);
}
