[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Build Status](https://travis-ci.org/majektom/satel-integra-integration-prot.svg?branch=master)](https://travis-ci.org/majektom/satel-integra-integration-prot)

# satel-integra-integration-prot
Node.js module for Satel Integra integration protocol

## Introduction
This is a *Node.js* module which can be used to implement a service or an application integrating an alarm system or a home automation system based on the [Satel Integra](https://www.satel.pl/en/cat/10184#cat10184) solution.

The module implements decoding of byte frames to the protocol messages and encoding of the protocol messages to byte frames accordingly to the [Satel Integra integration protocol specification](https://www.satel.pl/en/download/instrukcje/ethm1_plus_op_int_2020-03-05_4f512412.pdf). The module **does not** implement any kind of communication channel with the Satel Integra system.

## Status
The module doesn't support the full set of protocol messages yet.