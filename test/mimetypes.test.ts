import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ExtensionTypes, MimeTypes } from '../src/mimetypes';

describe('MimeTypes', () => {
    it('should be an object', () => {
        expect(MimeTypes).to.be.an('object');
    });
    it('shoud have mimetypes', () => {
        expect(MimeTypes).to.have.property('TextPlain');
        expect(MimeTypes.TextPlain).to.equal('text/plain');
        expect(MimeTypes.ImagePng).to.equal('image/png');        
    });
});

describe('ExtensionTypes', () => {
    it('should be an object', () => {
        expect(ExtensionTypes).to.be.an('object');
    });
    it('shoud have extension mapping', () => {
        expect(ExtensionTypes).to.have.property('.txt');
        expect(ExtensionTypes['.txt']).to.equal('text/plain');
        expect(ExtensionTypes['.jpg']).to.equal('image/jpeg');
        expect(ExtensionTypes['.jpeg']).to.equal('image/jpeg');
    });
});
