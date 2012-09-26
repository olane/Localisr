describe('The time conversion module', function(){
    it('should be able to convert numerical UTC offsets to the correct string', function(){
        offsetToString(5).should.equal('+0500');
        offsetToString(-7).should.equal('-0700');
        offsetToString(0).should.equal('+0000');
        offsetToString(82).should.equal('+8200');
        offsetToString(-13.75).should.equal('-1345');
        offsetToString(7.25).should.equal('+0715');
    });

    it('should be able to get a valid string representing the UTC offset for a timezone specified by its acronym', function(){
        targetTimezone = 'EST';
        zoneToOffsetString('GMT').should.equal('+0500');
    });

    it('should correctly localise time strings', function(){
        targetTimezone = 'GMT';
        convertTimeString('10:32 EST', '+0500', 'HH:mm').should.equal('05:32 GMT');
    });

    it('should correctly parse and convert time strings without minutes', function(){
        targetTimezone = 'GMT';
        parseTime('10 am EST', 'EST').should.equal('3pm GMT');
        parseTime('10am PST', 'PST').should.equal('6pm GMT');
        parseTime('10AM ADT', 'ADT').should.equal('1pm GMT');

        targetTimezone = 'EST';
        parseTime('9pm GMT', 'GMT').should.equal('4pm EST');
    });

    it('should correctly parse and convert time strings with minutes', function(){
        targetTimezone = 'GMT';
        parseTimeWithMinutes('10:22 EST', 'EST').should.equal('15:22 GMT');
    });

    describe('The regular expressions for parsing time strings', function(){
        it('should be able to detect multiple valid times in a string amongst other text', function(){
            var testString = 'Lorem ipsum 18:32 GMT dolor 10:23 PST sit amet';
            var matches = testString.match(r.regexp.time.matcher);
            matches.should.have.length(2);
        });

        it('should support times in 12-hour format', function(){
            '10am EST'.match(r.regexp.time.matcher).should.have.length(1);
        });

        it('should support AM/PM in upper or lower case', function(){
            var testString = '10AM EST foo 10am EST foo 10pm EST foo 10PM EST';
            var matches = testString.match(r.regexp.time.matcher);
            matches.should.have.length(4);
        });

        it('should support time zone acronyms in upper or lower case', function(){
            var testString = '10AM est foo 10AM EST foo 10PM pst foo 10PM EST';
            var matches = testString.match(r.regexp.time.matcher);
            matches.should.have.length(4);
        });

        it('should support multiple consecutive times with only whitespace between them', function(){
            var testString = '10AM EST 10AM EST 10AM EST';
            var matches = testString.match(r.regexp.time.matcher);
            matches.should.have.length(3);
        });

        it('should support multiple consecutive times with commas between them', function(){
            var testString = '10AM EST,10AM EST,10AM EST';
            var matches = testString.match(r.regexp.time.matcher);
            matches.should.have.length(3);
        });

        it('should support times without minutes', function(){
            '10am gmt'.match(r.regexp.time.matcher).should.have.length(1);
        });


        it('should support optional whitespace between the time and AM/PM', function(){
            '10 am gmt'.match(r.regexp.time.matcher).should.have.length(1);
        });
    });

    describe('The function for converting all times in a text node', function(){
        it('should not perform the conversion on a time that is already in the user\'s target timezone', function(){
            targetTimezone = 'GMT';
            var text = 'Lorem 18:30 GMT ipsum';
            var matches = text.match(r.regexp.time.matcher);
            var timeConverter = converters[1];
            timeConverter(text, matches).should.equal(text);
        });
    });
});
