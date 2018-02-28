import {List, Map} from "immutable";
import * as Filter from "./StreamFilter";
import {DomainEvent} from "./DomainEvent";
import * as uuid from "uuid";

describe('domain event filters', () => {
    const event = new DomainEvent({
        message_name: "TestEvent",
        uuid: uuid.v4(),
        payload: Map({"text": "a test event"}),
        metadata: Map({"foo": "bar", "_position": 2}),
        created_at: "2018-02-24T03:23:42.384206"
    })

    it("matches equal message name", () => {
        const eqFilter = new Filter.StreamFilter({
            type: Filter.EVENT_PROPERTY,
            property: "message_name",
            operator: Filter.EQUALS,
            value: "TestEvent"
        })

        expect(Filter.match(List.of(eqFilter), event)).toBe(true);
    })

    it("matches equal message name with property prefix", () => {
        const eqFilter = new Filter.StreamFilter({
            type: Filter.EVENT_PROPERTY,
            property: "event.message_name",
            operator: Filter.EQUALS,
            value: "TestEvent"
        })

        expect(Filter.match(List.of(eqFilter), event)).toBe(true);
    })

    it("matches equal metadata", () => {
        const eqFilter = new Filter.StreamFilter({
            type: Filter.METADATA,
            property: "foo",
            operator: Filter.EQUALS,
            value: "bar"
        })

        expect(Filter.match(List.of(eqFilter), event)).toBe(true);
    })

    it("matches equal metadata with property prefix", () => {
        const eqFilter = new Filter.StreamFilter({
            type: Filter.METADATA,
            property: "meta.foo",
            operator: Filter.EQUALS,
            value: "bar"
        })

        expect(Filter.match(List.of(eqFilter), event)).toBe(true);
    })

    it("matches greater than property", () => {
        const gtFilter = new Filter.StreamFilter({
            type: Filter.EVENT_PROPERTY,
            property: "created_at",
            operator: Filter.GREATER_THAN,
            value: "2018-02-23"
        })

        expect(Filter.match(List.of(gtFilter), event)).toBe(true);
    })

    it("matches greater than equal filter", () => {
        const filter = new Filter.StreamFilter({
            type: Filter.METADATA,
            property: "meta._position",
            operator: Filter.GREATER_THAN_EQUALS,
            value: "2"
        })

        expect(Filter.match(List.of(filter), event)).toBe(true);

        const falseFilter = new Filter.StreamFilter({
            type: Filter.METADATA,
            property: "meta._position",
            operator: Filter.GREATER_THAN_EQUALS,
            value: "3"
        })

        expect(Filter.match(List.of(falseFilter), event)).toBe(false);
    })

    it("makes sure that all filters match", () => {
        const gtFilter = new Filter.StreamFilter({
            type: Filter.EVENT_PROPERTY,
            property: "created_at",
            operator: Filter.GREATER_THAN,
            value: "2018-02-23"
        })

        const ltFilter = new Filter.StreamFilter({
            type: Filter.METADATA,
            property: "meta._position",
            operator: Filter.LOWER_THAN,
            value: "2"
        })

        expect(Filter.match(List.of(gtFilter, ltFilter), event)).toBe(false);
    })

    it("matches in filter", () => {
        const filter = new Filter.StreamFilter({
            type: Filter.METADATA,
            property: "meta.foo",
            operator: Filter.IN,
            value: "bar;baz"
        })

        expect(Filter.match(List.of(filter), event)).toBe(true);
    })

    it("matches not in filter", () => {
        const filter = new Filter.StreamFilter({
            type: Filter.METADATA,
            property: "meta.foo",
            operator: Filter.NOT_IN,
            value: "baz;bat"
        })

        expect(Filter.match(List.of(filter), event)).toBe(true);

        const falseFilter = new Filter.StreamFilter({
            type: Filter.METADATA,
            property: "meta.foo",
            operator: Filter.NOT_IN,
            value: "bar;bat"
        })

        expect(Filter.match(List.of(falseFilter), event)).toBe(false);
    })

    it("matches in filter with int cast", () => {
        const filter = new Filter.StreamFilter({
            type: Filter.METADATA,
            property: "meta._position",
            operator: Filter.IN,
            value: "2;3"
        })

        expect(Filter.match(List.of(filter), event)).toBe(true);

        const falseFilter = new Filter.StreamFilter({
            type: Filter.METADATA,
            property: "meta._position",
            operator: Filter.IN,
            value: "3;4"
        })

        expect(Filter.match(List.of(falseFilter), event)).toBe(false);
    })

    it("matches lower than filter", () => {
        const filter = new Filter.StreamFilter({
            type: Filter.METADATA,
            property: "meta._position",
            operator: Filter.LOWER_THAN,
            value: "3"
        })

        expect(Filter.match(List.of(filter), event)).toBe(true);

        const falseFilter = new Filter.StreamFilter({
            type: Filter.METADATA,
            property: "meta._position",
            operator: Filter.LOWER_THAN,
            value: "2"
        })

        expect(Filter.match(List.of(falseFilter), event)).toBe(false);
    })

    it("matches lower than equal filter", () => {
        const filter = new Filter.StreamFilter({
            type: Filter.METADATA,
            property: "meta._position",
            operator: Filter.LOWER_THAN_EQUALS,
            value: "2"
        })

        expect(Filter.match(List.of(filter), event)).toBe(true);

        const falseFilter = new Filter.StreamFilter({
            type: Filter.METADATA,
            property: "meta._position",
            operator: Filter.LOWER_THAN_EQUALS,
            value: "1"
        })

        expect(Filter.match(List.of(falseFilter), event)).toBe(false);
    })

    it("matches not equal filter", () => {
        const filter = new Filter.StreamFilter({
            type: Filter.METADATA,
            property: "meta._position",
            operator: Filter.NOT_EQUALS,
            value: "1"
        })

        expect(Filter.match(List.of(filter), event)).toBe(true);

        const falseFilter = new Filter.StreamFilter({
            type: Filter.METADATA,
            property: "meta._position",
            operator: Filter.NOT_EQUALS,
            value: "2"
        })

        expect(Filter.match(List.of(falseFilter), event)).toBe(false);
    })

    it("matches regex filter", () => {
        const filter = new Filter.StreamFilter({
            type: Filter.EVENT_PROPERTY,
            property: "event.message_name",
            operator: Filter.REGEX,
            value: "^Test.+$"
        })

        expect(Filter.match(List.of(filter), event)).toBe(true);

        const falseFilter = new Filter.StreamFilter({
            type: Filter.EVENT_PROPERTY,
            property: "event.message_name",
            operator: Filter.REGEX,
            value: "^Testing.+$"
        })

        expect(Filter.match(List.of(falseFilter), event)).toBe(false);
    })
})