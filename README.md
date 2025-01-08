
# Base DDD for TypeScript

![GitHub Repo stars](https://img.shields.io/github/stars/InovaTech-BG/base-ddd)
![NPM Downloads](https://img.shields.io/npm/d18m/%40inovatechbg%2Fbase-ddd)



This project has the purpose of providing a base for a Domain Driven Design (DDD) project using TypeScript.

This project implements ddd concepts like:
* Entities
* Aggregates
* Value Objects
* Domain Events
* Domain Services (Coming soon)
* Repositories (Coming soon)
* Use Cases (Coming soon)

## Why DDD?

DDD is a software development approach that focuses on the domain and the business rules that govern it. It is a way to structure your code in a way that it is easier to understand and maintain.

# Installation

#### NPM

```bash
npm install @inovatechbg/base-ddd
```

#### PNPM

```bash
pnpm add @inovatechbg/base-ddd
```

#### Yarn

```bash
yarn add @inovatechbg/base-ddd
```

# Usage

## Value Objects

If you want to set some validations, bussiness rules or even some formatting to a value, you can use a Value Object.

The Value Object is a class that extends the `ValueObject` class from the `@inovatechbg/base-ddd/value-objects` package.

```typescript
import { ValueObject } from '@inovatechbg/base-ddd/value-objects';

class Name extends ValueObject<string> { }
```

The `ValueObject` class has a `value` property that is the value of the Value Object. This value property is is of the type that you define in the generic type of the `ValueObject` class.

### Complex Value Objects

If you have a Value Object that has more than one property, you can create a class that extends the `ValueObject` class and has the properties that you need.

```typescript
import { ValueObject } from '@inovatechbg/base-ddd/value-objects';

class CustomVO extends ValueObject<{ name: string; age: number }> {}

class CustomComplexVO extends ValueObject<{ name: string; child: CustomVO }> {}
```

### Value Object Constructor

The Value Object constructor is a private constructor. You can't create a Value Object using the `new` keyword.

To create a Value Object, you need to create a static method that will create the Value Object.

```typescript
import { ValueObject } from '@inovatechbg/base-ddd/value-objects';

class Name extends ValueObject<string> {
  static create(value: string): Name {
    if (!value) {
      throw new Error('Name is required');
    }

    if (value.length < 3) {
      throw new Error('Name must have at least 3 characters');
    }

    return new Name(value);
  }
}

const name = Name.create('John');
```

### Value Object Getters

You can create getters in the Value Object to get some information from the value.

```typescript
import { ValueObject } from '@inovatechbg/base-ddd/value-objects';

class Name extends ValueObject<string> {
  static create(value: string): Name {
    if (!value) {
      throw new Error('Name is required');
    }

    if (value.length < 3) {
      throw new Error('Name must have at least 3 characters');
    }

    return new Name(value);
  }

  get firstLetter(): string {
    return this.value[0];
  }
}

const name = Name.create('John');

console.log(name.firstLetter); // J
```
#### `value` getter

The value of a Value Object is a private and readonly property. You can't change the value of a Value Object after it is created.

To get the value of a Value Object, you can use the `value` getter.

```typescript
import { ValueObject } from '@inovatechbg/base-ddd/value-objects';

class Name extends ValueObject<string> {
  static create(value: string): Name {
    if (!value) {
      throw new Error('Name is required');
    }

    if (value.length < 3) {
      throw new Error('Name must have at least 3 characters');
    }

    return new Name(value);
  }
}

const name = Name.create('John');

console.log(name.value); // John
```

#### `cleanValue` getter

The `cleanValue` getter returns the value of the Value Object the more clean as possible (if the value is a primitive type, it will return like the `value` getter. For more complex types, it will return as a clen object).

```typescript
import { ValueObject } from '@inovatechbg/base-ddd/value-objects';

class CustomVO extends ValueObject<{ name: string; age: number }> {}

class CustomComplexVO extends ValueObject<{ name: string; child: CustomVO }> {}

const customVO = CustomVO.create({ name: 'John', age: 30 });
const customComplexVO = CustomComplexVO.create({ name: 'John', child: customVO });

console.log(customVO.cleanValue); // { name: 'John', age: 30 }
console.log(customComplexVO.cleanValue); // { name: 'John', child: { name: 'John', age: 30 } }
```

##### `CleanValueObject<T>` type

The `CleanValueObject<T>` type is a type that will return the clean value of a Value Object.

```typescript
import { CleanValueObject } from '@inovatechbg/base-ddd/value-objects';

class CustomVO extends ValueObject<{ name: string; age: number }> {}

const customVO = CustomVO.create({ name: 'John', age: 30 });

const cleanValue: CleanValueObject<CustomVO> = customVO.cleanValue;

console.log(cleanValue); // { name: 'John', age: 30 }
```

### Value Object Methods

The `ValueObject` class has some methods that you can use to compare two Value Objects.

#### `equals` method

The `equals` method compares two Value Objects and returns a boolean.

```typescript
import { ValueObject } from '@inovatechbg/base-ddd/value-objects';

class Name extends ValueObject<string> {
  static create(value: string): Name {
    if (!value) {
      throw new Error('Name is required');
    }

    if (value.length < 3) {
      throw new Error('Name must have at least 3 characters');
    }

    return new Name(value);
  }
}

const name1 = Name.create('John');
const name2 = Name.create('John');

console.log(name1.equals(name2)); // true
```

##### Overriding the `equals` method

You can override the `equals` method to compare the Value Objects in a different way.

```typescript
import { ValueObject } from '@inovatechbg/base-ddd/value-objects';

class Name extends ValueObject<string> {
  static create(value: string): Name {
    if (!value) {
      throw new Error('Name is required');
    }

    if (value.length < 3) {
      throw new Error('Name must have at least 3 characters');
    }

    return new Name(value);
  }

  equals(name: Name): boolean {
    return this.value.toLowerCase() === name.value.toLowerCase();
  }
}

const name1 = Name.create('John');
const name2 = Name.create('john');

console.log(name1.equals(name2)); // true
```


#### `toString` method

The `toString` method returns the value of the Value Object.

```typescript
import { ValueObject } from '@inovatechbg/base-ddd/value-objects';

class Name extends ValueObject<string> {
  static create(value: string): Name {
    if (!value) {
      throw new Error('Name is required');
    }

    if (value.length < 3) {
      throw new Error('Name must have at least 3 characters');
    }

    return new Name(value);
  }
}

const name = Name.create('John');

console.log(name.toString()); // John
```

If the value of the Value Object is an object, the `toString` method will return a JSON string.

## Entities

Entities are objects that represent a unique object in the domain. The Entity has an identity that is unique in the domain.

The entity has props that are represented by native types, Value Objects or other Entities/Aggregates.

To create an Entity, you need to create a class that extends the `Entity` class from the `@inovatechbg/base-ddd/entities` package.

```typescript
import { Entity } from '@inovatechbg/base-ddd/entities';

interface UserProps {
  name: string;
  age: number;
}

class User extends Entity<UserProps> {}
```

### Entity Constructor

The Entity constructor is a private constructor. You can't create an Entity using the `new` keyword.

To create an Entity, you need to create a static method that will create the Entity.

```typescript
import { Entity } from '@inovatechbg/base-ddd/entities';

interface UserProps {
  name: string;
  age: number;
}

class User extends Entity<UserProps> {
  static create(props: UserProps): User {
    if (!props.name) {
      throw new Error('Name is required');
    }

    if (!props.age) {
      throw new Error('Age is required');
    }

    return new User(props);
  }
}

const user = User.create({ name: 'John', age: 30 });
```

### Entity Getters

The Entity values are a protected atributte. You can't access the values directly.

To access the values of an Entity, you need to create getters.

```typescript
import { Entity } from '@inovatechbg/base-ddd/entities';

interface UserProps {
  name: string;
  age: number;
}

class User extends Entity<UserProps> {
  static create(props: UserProps): User {
    if (!props.name) {
      throw new Error('Name is required');
    }

    if (!props.age) {
      throw new Error('Age is required');
    }

    return new User(props);
  }

  get name(): string {
    return this.props.name;
  }

  get age(): number {
    return this.props.age;
  }
}

const user = User.create({ name: 'John', age: 30 });

console.log(user.name); // John
console.log(user.age); // 30
```

### Entity Methods

The `Entity` class has some methods.

#### `equals` method

The `equals` method compares two Entities and returns a boolean.

```typescript
import { Entity } from '@inovatechbg/base-ddd/entities';

interface UserProps {
  name: string;
  age: number;
}

class User extends Entity<UserProps> {
  static create(props: UserProps): User {
    if (!props.name) {
      throw new Error('Name is required');
    }

    if (!props.age) {
      throw new Error('Age is required');
    }

    return new User(props);
  }
}

const user1 = User.create({ name: 'John', age: 30 });

const user2 = User.create({ name: 'John', age: 30 });

console.log(user1.equals(user2)); // true
```

##### Overriding the `equals` method

You can override the `equals` method to compare the Entities in a different way.

```typescript
import { Entity } from '@inovatechbg/base-ddd/entities';

interface UserProps {
  name: string;
  age: number;
}

class User extends Entity<UserProps> {
  static create(props: UserProps): User {
    if (!props.name) {
      throw new Error('Name is required');
    }

    if (!props.age) {
      throw new Error('Age is required');
    }

    return new User(props);
  }

  equals(user: User): boolean {
    return this.props.name.toLowerCase() === user.props.name.toLowerCase();
  }
}

const user1 = User.create({ name: 'John', age: 30 });
const user2 = User.create({ name: 'john', age: 30 });

console.log(user1.equals(user2)); // true
```

### Entity Identity

All of entities has an identity that is unique in this type of Entity in domain.

When you are creating an Entity, you need to pass the identity of the Entity as the second generic value. (default is UniqueEntityId, a UUID Value Object)

```typescript
import { Entity } from '@inovatechbg/base-ddd/entities';
import { UniqueEntityId } from '@inovatechbg/base-ddd/value-objects';

interface UserProps {
  name: string;
  age: number;
}

class User extends Entity<UserProps, UniqueEntityId> {
  static create(props: UserProps, id: UniqueEntityId): User {
    if (!props.name) {
      throw new Error('Name is required');
    }

    if (!props.age) {
      throw new Error('Age is required');
    }

    return new User(props, id);
  }
}

const id = UniqueEntityId.create();

const user = User.create({ name: 'John', age: 30 }, id);
```

#### Self Created Identity

If you want to create an Entity with a self created identity, you can pass the identity contructor as the second contructor value of Entity constructor.

```typescript
import { Entity } from '@inovatechbg/base-ddd/entities';
import { UniqueEntityId, UniqueEntityIdConstructor } from '@inovatechbg/base-ddd/value-objects';

interface UserProps {
  name: string;
  age: number;
}

class User extends Entity<UserProps, UniqueEntityId> {
  static create(props: UserProps, id: UniqueEntityId): User {
    if (!props.name) {
      throw new Error('Name is required');
    }

    if (!props.age) {
      throw new Error('Age is required');
    }

    return new User(props, id ?? new UniqueEntityIdConstructor());
  }
}

const user = User.create({ name: 'John', age: 30 });
```

#### Default Identities 

The `@inovatechbg/base-ddd/entities` package has some default identities that you can use.

##### `UniqueEntityId`

The `UniqueEntityId` is a Value Object that has a UUID as the value.

```typescript
import { UniqueEntityId } from '@inovatechbg/base-ddd/value-objects';

const id = UniqueEntityId.create();

console.log(id.value); // 123e4567-e89b-12d3-a456-426614174000
```

##### `IncrementalEntityId`

The `IncrementalEntityId` is a Value Object that has a number as the value.

```typescript
import { IncrementalEntityId } from '@inovatechbg/base-ddd/value-objects';

const id = IncrementalEntityId.create();

console.log(id.value); // -1
```

The `IncrementalEntityId` return -1 as the default value.

#### Creating You Own Identity

If you want to create your own identity, you can create a class that extends the `Id` class from the `@inovatechbg/base-ddd/entities` package, passing the type of the identity as the generic type.

You need to create a method `id` that will return the identity value.

```typescript
import { Id } from '@inovatechbg/base-ddd/value-objects';

class UserId extends Id<string> {
  id(): string {
    return this.value;
  }
}
```

Is recommended to create another class with same name adding `Constructor` to create the identity.

This class muts extends the `IdConstructor` class from the `@inovatechbg/base-ddd/entities` package.

If you did that, you must to implement a method `create` that will receive the identity value and return a new instance of the identity. 

```typescript
import { IdConstructor } from '@inovatechbg/base-ddd/entities';

class UserIdConstructor extends IdConstructor<UserId> {
  create(value: string): UserId {
    return new UserId(value);
  }
}
```

You also have a type `IdType<Type>` that will return the value type of the identity.

```typescript
import { IdType } from '@inovatechbg/base-ddd/entities';
import { Id } from '@inovatechbg/base-ddd/value-objects';

class UserId extends Id<string> {}

const id: IdType<UserId> = '123e4567-e89b-12d3-a456-426614174000';
```

#### Using Your Own Identity

To use your own identity, you need to pass the identity class as the second generic value of the Entity constructor.

```typescript
import { Entity } from '@inovatechbg/base-ddd/entities';
import { UserId, UserIdConstructor } from './UserId';

interface UserProps {
  name: string;
  age: number;
}

class User extends Entity<UserProps, UserId> {
  static create(props: UserProps, id: UserId): User {
    if (!props.name) {
      throw new Error('Name is required');
    }

    if (!props.age) {
      throw new Error('Age is required');
    }

    return new User(props, id);
  }
}

const id = new UserIdConstructor().create('123e4567-e89b-12d3-a456-426614174000');

const user = User.create({ name: 'John', age: 30 }, id);
```

### Entity vs Aggregate

If you would like to use a Entity list as a property of another Entity, the main entity should be a [Aggregate](#Aggregate).

But, the child entity list can be a normal array.
 
The same concept can be applied to single entities.

That will be more explained in the [Aggregates](#Aggregates) section, but pay attention if the entity need to be a Aggregate (having a child entity), or only an entity with a reference to another entity as an Id (like a foreign key in a database).

#### Watched List

If you want to turn the lists more useful, you can use Watched Lists.

We are working on another package to provide this feature. (Coming soon)

## Aggregates

Aggregates are a group of entities that are treated as a single unit.

The Aggregate has an Entity that is the root of the Aggregate. The root Entity is the only Entity that should be accessed from outside the Aggregate.

To create an Aggregate, you need to create a class that extends the `AggregateRoot` class from the `@inovatechbg/base-ddd/entities` package.

```typescript
import { AggregateRoot } from '@inovatechbg/base-ddd/entities';
import { Attachment } from './Attachment';

interface EmailProps {
  subject: string;
  body: string;
  attachments: Attachment[];
}

class Email extends AggregateRoot<EmailProps> {}
```

### Aggregate extended from Entity

The Aggregate is an Entity with some more features and concepts applied. So, things like Construcotr, Getters, Methods and Identity can be used in the Aggregate as the same way.

```typescript
import { AggregateRoot } from '@inovatechbg/base-ddd/entities';

interface EmailProps {
  subject: string;
  body: string;
}

class Email extends AggregateRoot<EmailProps> {
  static create(props: EmailProps): Email {
    if (!props.subject) {
      throw new Error('Subject is required');
    }

    if (!props.body) {
      throw new Error('Body is required');
    }

    return new Email(props);
  }

  get subject(): string {
    return this.props.subject;
  }

  get body(): string {
    return this.props.body;
  }
}

const email = Email.create({ subject: 'Hello', body: 'Hello, World!' });

console.log(email.subject); // Hello
console.log(email.body); // Hello, World!
```

## Domain Events

Domain Events are events that are triggered when something happens in the domain.

All of the Domain Events should be created based on Aggregate action (like creation, uptade, or deletion). But should be executed just after the action is completed (like a transaction).

### Creating an Domain Event

To create a Domain Event, you need to create a class that implements the `DomainEvent` interface from the `@inovatechbg/base-ddd/events` package.

The domain event must have the attribute `ocurredAt` that is a Date object with the time that the event ocurred.

The domain event also must have an method `getAggregateId` that will return the aggregate id that the event is related.

Is recommended to add an private attribute aggregate with the full aggregate, to be used to get the aggregate id.

```typescript
import { DomainEvent } from '@inovatechbg/base-ddd/events';

class UserCreated implements DomainEvent {
  ocurredAt: Date;
  private aggregate: User;

  constructor(aggregate: User) {
    this.ocurredAt = new Date();
    this.aggregate = aggregate;
  }

  getAggregateId(): string {
    return this.aggregate.id.id();
  }
}
```

### Creating an Event Handler

To handle the Domain Event, you need to create a class that implements the `EventHandler` interface from the `@inovatechbg/base-ddd/events` package.

You need to pass the Domain Event class that the handler will handle as the generic type of the EventHandler.

The handler must have a method `handle` that will receive the Domain Event and do something with it.

You can receive anythig in the Event Handler constructor, like a repository, a service or anything that you need to handle the event.

as the parameter of the handle method, you will receive the event, and do anything with it.

```typescript
import { EventHandler } from '@inovatechbg/base-ddd/events';
import { UserCreated } from './UserCreated';

class UserCreatedHandler implements EventHandler<UserCreated> {
  constructor(private emailService: EmailService, private userRepository: UserRepository) {}

  async handle(event: UserCreated): Promise<void> {
    const user = await this.userRepository.findById(event.getAggregateId());
    await this.emailService.sendWelcomeEmail(user.email);
  }
}
```

### Using the `DomainEvents` class

To use the Domain Events, you need to use the `DomainEvents` class from the `@inovatechbg/base-ddd/events` package.

The `DomainEvents` class has some methods that you can use to interact with the Domain Events.

#### `register` method

The `register` method is used to register a Event Handler, passing the Event Handler class as the parameter.

You also need to pass the name of the event that the handler will handle.

```typescript
import { DomainEvents } from '@inovatechbg/base-ddd/events';
import { UserCreatedHandler } from './UserCreatedHandler';
import { UserCreated } from './UserCreated';
import { EmailService } from './EmailService';
import { UserRepository } from './UserRepository';

const emailService = new EmailService();
const userRepository = new UserRepository();

const userCreatedHandler = new UserCreatedHandler(emailService, userRepository);

DomainEvents.register(userCreatedHandler, UserCreated.name);
```

#### `dispatchEventsForAggregate` method

The `dispatchEventsForAggregate` method is used to dispatch the Domain Events for an Aggregate.

You need to pass the aggregate.id as the parameter.

```typescript
import { DomainEvents } from '@inovatechbg/base-ddd/events';

DomainEvents.dispatchEventsForAggregate(aggregate.id);
```

### Creating a Domain Event in aggregate action

To create a Domain Event in an Aggregate action, in the action inside or outside the aggregate, you need to call the method `addDomainEvent` from the aggregate.

This method will add the Domain Event to the aggregate and to DomainEvents wait list.

So, if you call the `dispatchEventsForAggregate` method, the Domain Event will be dispatched.

```typescript
import { AggregateRoot } from '@inovatechbg/base-ddd/entities';
import { DomainEvents } from '@inovatechbg/base-ddd/events';
import { UserCreated } from './UserCreated';

interface UserProps {
  name: string;
  age: number;
}

class User extends AggregateRoot<UserProps> {
  static create(props: UserProps): User {
    if (!props.name) {
      throw new Error('Name is required');
    }

    if (!props.age) {
      throw new Error('Age is required');
    }

    const user = new User(props);

    user.addDomainEvent(new UserCreated(user));

    return user;
  }

  get name(): string {
    return this.props.name;
  }

  get age(): number {
    return this.props.age;
  }
}

const user = User.create({ name: 'John', age: 30 });

DomainEvents.dispatchEventsForAggregate(user.id);
```

## Repositories (Coming soon)

Repositories are used to store and retrieve Aggregates, Entities or Value Objects from the persistence layer.

## Use Cases (Coming soon)

Use Cases are used to execute a business rule or a business flow.

# Conclusion

This project is a base for a Domain Driven Design project using TypeScript.

# Contributing

If you want to contribute to this project, you can fork this repository and create a pull request.

![GitHub contributors](https://img.shields.io/github/contributors/InovaTech-BG/base-ddd)


# License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```
